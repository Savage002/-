import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { query } from '../lib/db.js';
import { requireAuth, requireRole, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

const ALLOWED_ROLES = ['admin', 'manager'];

// A precomputed bcrypt hash with no matching plaintext — used to keep the
// login path's timing the same whether or not the username exists, so a
// missing account can't be inferred from response latency.
const DUMMY_HASH = '$2b$10$CACHhVWIzYYD5xIQ4/6D3.qF0Qw8Z0i9m8sJHRQ3jz7cQeS0h8O2S';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Слишком много попыток входа. Попробуйте позже.' },
});

router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    try {
        // Check users table
        const userRes = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userRes.rows[0];

        // Always run a bcrypt compare, even for an unknown username, so the
        // response time doesn't leak whether the account exists.
        const isMatch = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

        if (user) {
            if (isMatch) {
                const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h', algorithm: 'HS256' });

                // Log login success
                await query('INSERT INTO system_logs (event_type, user_id, details) VALUES ($1, $2, $3)',
                    ['LOGIN_SUCCESS', user.id, `User ${username} logged in successfully`]
                );

                return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            }
        }

        // Log login failure
        await query('INSERT INTO system_logs (event_type, details) VALUES ($1, $2)',
            ['LOGIN_FAILED', `Failed login attempt for user: ${username}`]
        );

        res.status(401).json({ message: 'Invalid credentials' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Returns the identity behind the current token (used by the frontend to validate sessions)
router.get('/me', requireAuth, async (req, res) => {
    try {
        const result = await query('SELECT id, username, name, surname, role FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Only an existing admin may create new accounts
router.post('/register', requireAuth, requireRole('admin'), async (req, res) => {
    const { username, password, role, name, surname } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'username, password и role обязательны' });
    }
    if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ message: 'Недопустимая роль' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });
    }

    try {
        const existing = await query('SELECT id FROM users WHERE username = $1', [username]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Пользователь с таким именем уже существует' });
        }

        const hash = await bcrypt.hash(password, 10);
        const result = await query(
            'INSERT INTO users (username, password_hash, role, name, surname) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role',
            [username, hash, role, name || '', surname || '']
        );

        await query('INSERT INTO system_logs (event_type, user_id, details) VALUES ($1, $2, $3)',
            ['USER_CREATED', req.user.id, `New user created: ${username} (${role})`]
        );

        res.status(201).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all users (admin only — contains PII / usernames usable for brute-forcing)
router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const result = await query(
            'SELECT id, username, name, surname, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH change password — admins can reset anyone's password;
// non-admins may only change their own, and must prove they know the current one.
router.patch('/users/:id/password', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { password, currentPassword } = req.body;

    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Некорректный идентификатор' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });
    }

    const isSelf = req.user.id === id;
    const isAdmin = req.user.role === 'admin';

    if (!isSelf && !isAdmin) {
        return res.status(403).json({ message: 'Недостаточно прав' });
    }

    try {
        if (isSelf && !isAdmin) {
            const userRes = await query('SELECT password_hash FROM users WHERE id = $1', [id]);
            if (userRes.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
            const matches = currentPassword ? await bcrypt.compare(currentPassword, userRes.rows[0].password_hash) : false;
            if (!matches) {
                return res.status(401).json({ message: 'Текущий пароль указан неверно' });
            }
        }

        const hash = await bcrypt.hash(password, 10);
        const result = await query('UPDATE users SET password_hash=$1 WHERE id=$2 RETURNING id, username', [hash, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
        await query('INSERT INTO system_logs (event_type, user_id, details) VALUES ($1, $2, $3)',
            ['USER_UPDATED', req.user.id, `Password changed for user: ${result.rows[0].username}`]
        );
        res.json({ message: 'Пароль обновлён', user: result.rows[0] });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE user (admin only) — cannot delete yourself or the last remaining admin
router.delete('/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Некорректный идентификатор' });
    }
    if (id === req.user.id) {
        return res.status(400).json({ message: 'Нельзя удалить собственную учётную запись' });
    }
    try {
        const targetRes = await query('SELECT role FROM users WHERE id=$1', [id]);
        if (targetRes.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });

        if (targetRes.rows[0].role === 'admin') {
            const adminCount = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'");
            if (adminCount.rows[0].count <= 1) {
                return res.status(400).json({ message: 'Нельзя удалить последнего администратора' });
            }
        }

        const result = await query('DELETE FROM users WHERE id=$1 RETURNING id, username', [id]);
        await query('INSERT INTO system_logs (event_type, user_id, details) VALUES ($1, $2, $3)',
            ['USER_DELETED', req.user.id, `User deleted: ${result.rows[0].username}`]
        );
        res.json({ message: 'Пользователь удалён' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
