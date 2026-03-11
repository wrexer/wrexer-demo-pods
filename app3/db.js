const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS certificates (
                id          TEXT PRIMARY KEY,
                name        TEXT NOT NULL,
                email       TEXT NOT NULL,
                program     TEXT NOT NULL,
                issued_at   DATE NOT NULL DEFAULT CURRENT_DATE,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
};

// Derive a short program code from a program name
// e.g. "Bootcamp" -> "BC", "Full Stack" -> "FS", "Data Science" -> "DS"
const getProgramCode = (program) => {
    if (program.trim().toLowerCase() === 'bootcamp') {
        return 'BC';
    }
    const words = program.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].slice(0, 3).toUpperCase();
    }
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
};

const generateCertId = async (program) => {
    const year = new Date().getFullYear();
    const code = getProgramCode(program);
    const prefix = `WRX-${code}-${year}-`;

    // Count how many certs already have this prefix to determine sequence
    const result = await pool.query(
        `SELECT COUNT(*) FROM certificates WHERE id LIKE $1`,
        [`${prefix}%`]
    );
    const seq = parseInt(result.rows[0].count, 10) + 1;
    const seqStr = String(seq).padStart(3, '0');
    return `${prefix}${seqStr}`;
};

const getCertificateById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM certificates WHERE id = $1',
        [id.toUpperCase()]
    );
    return result.rows[0] || null;
};

const getAllCertificates = async () => {
    const result = await pool.query(
        'SELECT * FROM certificates ORDER BY created_at DESC'
    );
    return result.rows;
};

const createCertificate = async ({ name, email, program }) => {
    const id = await generateCertId(program);
    const result = await pool.query(
        `INSERT INTO certificates (id, name, email, program)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, name, email, program]
    );
    return result.rows[0];
};

const deleteCertificate = async (id) => {
    const result = await pool.query(
        'DELETE FROM certificates WHERE id = $1 RETURNING id',
        [id.toUpperCase()]
    );
    return result.rowCount > 0;
};

module.exports = {
    initDb,
    getCertificateById,
    getAllCertificates,
    createCertificate,
    deleteCertificate,
};
