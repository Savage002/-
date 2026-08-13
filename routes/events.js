import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        let queryText = `SELECT * FROM events`;
        const params = [];
        
        if (lang) {
            queryText += ` WHERE language = $1`;
            params.push(lang);
        }
        
        queryText += ` ORDER BY event_date ASC`;
        
        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// GET single event
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ message: 'Failed to fetch event details' });
    }
});

// POST new event
router.post('/', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { title, event_date, time, location, language, news_id } = req.body;
    try {
        const result = await query(
            'INSERT INTO events (title, event_date, time, location, language, news_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, event_date, time, location || null, language || 'ru', news_id || null]
        );
        res.status(201).json({ message: 'Мероприятие добавлено', event: result.rows[0] });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event' });
    }
});

// PUT update event
router.put('/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { id } = req.params;
    const { title, event_date, time, location, language, news_id } = req.body;
    try {
        const result = await query(
            'UPDATE events SET title=$1, event_date=$2, time=$3, location=$4, language=$5, news_id=$6 WHERE id=$7 RETURNING *',
            [title, event_date, time, location || null, language, news_id || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Мероприятие не найдено' });
        res.json({ message: 'Мероприятие обновлено', event: result.rows[0] });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Failed to update event' });
    }
});

// DELETE event
router.delete('/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM events WHERE id=$1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Мероприятие не найдено' });
        res.json({ message: 'Мероприятие удалено' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event' });
    }
});

export default router;
