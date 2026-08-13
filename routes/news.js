import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Only allow storing images that were uploaded through our own /api/upload
// endpoint — this blocks anonymous injection of external tracking/beacon URLs.
const isSafeImageUrl = (url) => typeof url === 'string' && /^\/uploads\/[A-Za-z0-9._-]+$/.test(url);

router.get('/', async (req, res) => {
    try {
        const { limit, lang } = req.query;
        let queryText = `
            SELECT n.id, n.title, n.content, n.created_at, n.language,
                   (SELECT image_url FROM news_images WHERE news_id = n.id ORDER BY display_order LIMIT 1) as image_url
            FROM news n
            WHERE 1=1
        `;

        const params = [];
        let paramIndex = 1;

        if (lang) {
            queryText += ` AND n.language = $${paramIndex}`;
            params.push(lang);
            paramIndex++;
        }

        queryText += ` ORDER BY n.created_at DESC`;

        if (limit) {
            queryText += ` LIMIT $${paramIndex}`;
            params.push(parseInt(limit));
        } else {
            queryText += ` LIMIT 100`;
        }

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Failed to fetch news' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const newsResult = await query('SELECT * FROM news WHERE id = $1', [id]);

        if (newsResult.rows.length === 0) {
            return res.status(404).json({ message: 'News not found' });
        }

        const newsItem = newsResult.rows[0];
        const imagesResult = await query('SELECT image_url FROM news_images WHERE news_id = $1 ORDER BY display_order', [id]);
        const images = imagesResult.rows.map(row => row.image_url);

        res.json({ ...newsItem, images });
    } catch (error) {
        console.error('Error fetching news detail:', error);
        res.status(500).json({ message: 'Failed to fetch news detail' });
    }
});

router.post('/', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { title, content, images, language } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'title и content обязательны' });
    }

    try {
        const newsResult = await query(
            'INSERT INTO news (title, content, created_by, language) VALUES ($1, $2, $3, $4) RETURNING id',
            [title, content, req.user.id, language || 'ru']
        );
        const newsId = newsResult.rows[0].id;

        const safeImages = Array.isArray(images) ? images.filter(isSafeImageUrl) : [];
        for (let i = 0; i < safeImages.length; i++) {
            await query(
                'INSERT INTO news_images (news_id, image_url, display_order) VALUES ($1, $2, $3)',
                [newsId, safeImages[i], i]
            );
        }

        res.status(201).json({ message: 'News created successfully', newsId });
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ message: 'Failed to create news' });
    }
});

// PUT - update news
router.put('/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { id } = req.params;
    const { title, content, language } = req.body;
    try {
        const result = await query(
            'UPDATE news SET title=$1, content=$2, language=$3 WHERE id=$4 RETURNING id, title, language',
            [title, content, language, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Новость не найдена' });
        res.json({ message: 'Новость обновлена', news: result.rows[0] });
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ message: 'Failed to update news' });
    }
});

// DELETE - delete news and its images
router.delete('/:id', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM news_images WHERE news_id=$1', [id]);
        const result = await query('DELETE FROM news WHERE id=$1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Новость не найдена' });
        res.json({ message: 'Новость удалена' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ message: 'Failed to delete news' });
    }
});

// DELETE - remove single image from news
router.delete('/:id/images/:imgId', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { imgId } = req.params;
    try {
        await query('DELETE FROM news_images WHERE id=$1', [imgId]);
        res.json({ message: 'Изображение удалено' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});

// POST - add images to existing news
router.post('/:id/images', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
    const { id } = req.params;
    const { images } = req.body;
    try {
        const safeImages = Array.isArray(images) ? images.filter(isSafeImageUrl) : [];
        const countRes = await query('SELECT COALESCE(MAX(display_order), -1) as maxord FROM news_images WHERE news_id=$1', [id]);
        let order = countRes.rows[0].maxord + 1;
        for (const url of safeImages) {
            await query('INSERT INTO news_images (news_id, image_url, display_order) VALUES ($1, $2, $3)', [id, url, order++]);
        }
        const allImgs = await query('SELECT id, image_url, display_order FROM news_images WHERE news_id=$1 ORDER BY display_order', [id]);
        res.json({ message: 'Изображения добавлены', images: allImgs.rows });
    } catch (error) {
        console.error('Error adding images:', error);
        res.status(500).json({ message: 'Failed to add images' });
    }
});

export default router;

