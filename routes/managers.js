import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all managers (filtered by language)
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        let queryText = 'SELECT * FROM managers';
        const params = [];

        if (lang) {
            queryText += ' WHERE language = $1';
            params.push(lang);
        }

        queryText += ' ORDER BY display_order ASC';

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching managers:', error);
        res.status(500).json({ message: 'Failed to fetch managers' });
    }
});

// Create a new manager
router.post('/', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { name, role, image_url, language, display_order } = req.body;
    try {
        const result = await query(
            'INSERT INTO managers (name, role, image_url, language, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, role, image_url, language || 'ru', display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating manager:', error);
        res.status(500).json({ message: 'Failed to create manager' });
    }
});

// Update a manager
router.put('/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { id } = req.params;
    const { name, role, image_url, language, display_order } = req.body;
    try {
        const result = await query(
            'UPDATE managers SET name = $1, role = $2, image_url = $3, language = $4, display_order = $5 WHERE id = $6 RETURNING *',
            [name, role, image_url, language, display_order, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating manager:', error);
        res.status(500).json({ message: 'Failed to update manager' });
    }
});

// Delete a manager
router.delete('/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM managers WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.json({ message: 'Manager deleted successfully' });
    } catch (error) {
        console.error('Error deleting manager:', error);
        res.status(500).json({ message: 'Failed to delete manager' });
    }
});

export default router;
