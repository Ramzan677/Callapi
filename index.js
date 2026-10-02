const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// Keys Configuration (YYYY-MM-DD)
const VALID_KEYS = {
    "RAMZAN_1DAY": "2026-10-03",
    "RAMZAN_1MTH": "2026-11-02"
};

app.get('/bomb', (req, res) => {
    const { number, count, key } = req.query;

    // 1. Key check
    if (!key) {
        return res.status(401).json({
            status: false,
            error: "Key parameter is required."
        });
    }

    // 2. Validate Key
    const expiryDateStr = VALID_KEYS[key];
    if (!expiryDateStr) {
        return res.status(403).json({
            status: false,
            error: "Invalid API Key."
        });
    }

    // 3. Expiry Date Logic
    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    expiryDate.setHours(23, 59, 59, 999);

    if (today > expiryDate) {
        return res.status(403).json({
            status: false,
            error: `API key '${key}' expired on ${expiryDateStr}.`
        });
    }

    // 4. Number check
    if (!number) {
        return res.status(400).json({
            status: false,
            error: "Number parameter is required."
        });
    }

    // Dynamic count
    const finalCount = count !== undefined ? count : 1;

    // Main Target API URL
    const targetUrl = `https://multibombapi-taupe.vercel.app/bomb?number=${encodeURIComponent(number)}&count=${encodeURIComponent(finalCount)}&method=whatsapp`;

    // Background process trigger
    axios.get(targetUrl)
        .then(() => {
            console.log(`Success: Task started for ${number} | Count: ${finalCount}`);
        })
        .catch((err) => {
            console.error("Background API error:", err.message);
        });

    // JSON Output Response
    return res.status(200).json({
        status: true,
        message: "work start in bacground developed by Ramzan Ahsan",
        group: "https://chat.whatsapp.com/FiZBn0BykHX47d1iHLOay1",
        data: {
            number: number,
            count: Number(finalCount),
            key: key,
            key_expires: expiryDateStr
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
