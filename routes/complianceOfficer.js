import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET compliance officer info
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM compliance_officer ORDER BY id LIMIT 1');
        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching compliance officer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT - update compliance officer (admin)
router.put('/', requireAuth, requireRole('admin'), async (req, res) => {
    const { full_name, position, phone, email, reception_schedule, photo_url, description } = req.body;
    try {
        const existing = await query('SELECT id FROM compliance_officer LIMIT 1');
        let result;
        if (existing.rows.length > 0) {
            result = await query(
                `UPDATE compliance_officer SET full_name=$1, position=$2, phone=$3, email=$4,
                 reception_schedule=$5, photo_url=$6, description=$7, updated_at=NOW()
                 WHERE id=$8 RETURNING *`,
                [full_name, position, phone, email, reception_schedule, photo_url, description, existing.rows[0].id]
            );
        } else {
            result = await query(
                `INSERT INTO compliance_officer (full_name, position, phone, email, reception_schedule, photo_url, description)
                 VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
                [full_name, position, phone, email, reception_schedule, photo_url, description]
            );
        }
        res.json({ message: 'Обновлено', officer: result.rows[0] });
    } catch (error) {
        console.error('Error updating compliance officer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
