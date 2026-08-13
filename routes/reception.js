import express from 'express';
import { query } from '../lib/db.js';

const router = express.Router();

// GET /api/reception — get all reception schedule entries from managers table
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        let sql = `SELECT id, name, role, photo_url, image_url, reception_day, reception_time, display_order
                   FROM managers`;
        const params = [];
        if (lang) {
            sql += ` WHERE language = $1`;
            params.push(lang);
        }
        sql += ` ORDER BY display_order ASC`;
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reception data:', error);
        res.status(500).json({ message: 'Failed to fetch reception data' });
    }
});


export default router;
