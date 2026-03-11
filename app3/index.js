require('dotenv').config();
const express = require('express');
const path = require('path');
const { initDb } = require('./db');
const verifyRoutes = require('./routes/verify');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', verifyRoutes);
app.use('/', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'wrexr-certcheck' });
});

// Start server after DB is ready
initDb().then(() => {
    app.listen(port, () => {
        console.log(`Wrexr CertCheck listening at http://localhost:${port}`);
    });
});
