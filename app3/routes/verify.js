const express = require('express');
const path = require('path');
const { getCertificateById } = require('../db');

const router = express.Router();

// Serve the public verification page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Direct certificate URL — serve same page (JS reads the path)
router.get('/c/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// API: verify a certificate by ID
router.get('/api/verify/:id', async (req, res) => {
    try {
        const cert = await getCertificateById(req.params.id);
        if (!cert) {
            return res.json({ found: false });
        }
        res.json({ found: true, certificate: cert });
    } catch (err) {
        console.error('Error verifying certificate:', err);
        res.status(500).json({ error: 'Failed to verify certificate' });
    }
});

module.exports = router;
