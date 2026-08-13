import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Define it in the environment before starting the server.');
}

// Verifies the Bearer token and attaches { id, role } to req.user
export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        req.user = { id: payload.id, role: payload.role };
        next();
    } catch {
        return res.status(401).json({ message: 'Недействительный или истёкший токен' });
    }
}

// Must be used after requireAuth. Restricts access to the given roles.
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Недостаточно прав' });
        }
        next();
    };
}

export { JWT_SECRET };
