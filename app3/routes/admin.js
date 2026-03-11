const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { getAllCertificates, createCertificate, deleteCertificate } = require('../db');

const router = express.Router();

// ------------------------------------------------------------------
// Auth helpers — stateless HMAC token, no extra dependencies needed
// ------------------------------------------------------------------

const makeToken = (password) => {
    return crypto
        .createHmac('sha256', password)
        .update('wrexr-cert-admin')
        .digest('hex');
};

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const expected = makeToken(process.env.ADMIN_PASSWORD || '');
    if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    next();
};

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------

// Serve the admin UI
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// POST /api/admin/login — validate password, return token
router.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!adminPassword) {
        return res.status(500).json({ error: 'Admin password not configured' });
    }

    if (!password || password !== adminPassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = makeToken(adminPassword);
    res.json({ token });
});

// GET /api/admin/certificates — list all certificates
router.get('/api/admin/certificates', authMiddleware, async (req, res) => {
    try {
        const certs = await getAllCertificates();
        res.json(certs);
    } catch (err) {
        console.error('Error listing certificates:', err);
        res.status(500).json({ error: 'Failed to list certificates' });
    }
});

// POST /api/admin/certificates — create a new certificate
router.post('/api/admin/certificates', authMiddleware, async (req, res) => {
    const { name, email, program } = req.body;

    if (!name || !email || !program) {
        return res.status(400).json({ error: 'name, email, and program are required' });
    }

    try {
        const cert = await createCertificate({ name, email, program });
        res.status(201).json(cert);
    } catch (err) {
        console.error('Error creating certificate:', err);
        res.status(500).json({ error: 'Failed to create certificate' });
    }
});

// DELETE /api/admin/certificates/:id — delete a certificate
router.delete('/api/admin/certificates/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await deleteCertificate(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Certificate not found' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting certificate:', err);
        res.status(500).json({ error: 'Failed to delete certificate' });
    }
});

module.exports = router;
