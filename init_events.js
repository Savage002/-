import { query } from './lib/db.js';

async function init() {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                event_date DATE NOT NULL,
                time VARCHAR(50),
                language VARCHAR(10) DEFAULT 'ru',
                news_id INTEGER REFERENCES news(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Events table created successfully');
        process.exit(0);
    } catch (e) {
        console.error('❌ Error creating events table:', e);
        process.exit(1);
    }
}

init();
