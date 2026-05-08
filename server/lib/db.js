import pkg from 'pg';
import "dotenv/config";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected');
        client.release();

        // Create tables if they don't exist
        await initializeTables();
        console.log('Database tables initialized');
    } catch (error) {
        console.log('Database connection failed:', error.message);
        console.log('Server will continue running without database');
    }
};

export const query = (text, params) => {
    return pool.query(text, params);
};

async function initializeTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                profilePic VARCHAR(500),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                senderId INTEGER NOT NULL REFERENCES users(id),
                receiverId INTEGER NOT NULL REFERENCES users(id),
                message TEXT,
                image VARCHAR(500),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.error('Error creating tables:', error.message);
    }
}