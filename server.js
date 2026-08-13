import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './lib/db.js';

// Routes
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import managersRoutes from './routes/managers.js';
import logsRoutes from './routes/logs.js';
import uploadRoutes from './routes/upload.js';
import receptionRoutes from './routes/reception.js';
import complianceOfficerRoutes from './routes/complianceOfficer.js';
import departmentsRoutes from './routes/departments.js';
import eventsRoutes from './routes/events.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'default-src': ["'self'"],
            'script-src': ["'self'"],
            'object-src': ["'none'"],
        },
    },
}));

const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
}));
app.use(express.json());
app.set('trust proxy', 1);

// Static files — served with a locked-down CSP/nosniff so an uploaded file
// (even one that slipped past the upload allowlist) can never execute as
// script on this origin, and force download instead of inline rendering.
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
    setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    },
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/managers', managersRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reception', receptionRoutes);
app.use('/api/compliance-officer', complianceOfficerRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/events', eventsRoutes);

// Database Initialization
const initDB = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                event_date DATE NOT NULL,
                time VARCHAR(50),
                location VARCHAR(255),
                language VARCHAR(10) DEFAULT 'ru',
                news_id INTEGER REFERENCES news(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS location VARCHAR(255);`);
        console.log('✅ Events table verified (with location)');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    }
};

initDB();


// Health check
app.get('/api/health', async (req, res) => {
    try {
        await query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

// 404 for unmatched API routes
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Final error handler — never leak stack traces / internals to the client
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    });
});

// An uncaught exception means the process is in an unknown state — log it
// and exit so the process manager (Docker `restart: always`) can restart us
// cleanly, instead of limping along silently.
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME || 'zqai_db'} @ ${process.env.DB_HOST || 'localhost'}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
