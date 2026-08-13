import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Only allow a small set of image MIME types — the extension is derived from
// this validated value, never from the client-supplied filename, so an
// attacker can't upload an .html/.svg payload that gets served as text/html.
const ALLOWED_MIME_TO_EXT = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = ALLOWED_MIME_TO_EXT[file.mimetype];
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TO_EXT[file.mimetype]) {
            return cb(new Error('Недопустимый тип файла. Разрешены только JPG, PNG, WEBP, GIF.'));
        }
        cb(null, true);
    },
});

router.post('/', requireAuth, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            const message = err instanceof multer.MulterError
                ? (err.code === 'LIMIT_FILE_SIZE' ? 'Файл слишком большой (максимум 5MB)' : err.message)
                : err.message;
            return res.status(400).json({ message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    });
});

export default router;
