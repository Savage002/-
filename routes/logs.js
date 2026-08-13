import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const result = await query('SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Failed to fetch logs' });
    }
});

export default router;
