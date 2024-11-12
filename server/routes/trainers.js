const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/get-trainers', (req, res) => {
    const specialty = req.query.specialty;

    // SQL query to find trainers by specialty
    const sql = `
        SELECT name 
        FROM users 
        WHERE user_id IN (
            SELECT user_id 
            FROM trainers 
            WHERE specialty LIKE ?
        );
    `;

    // Execute the query with the provided specialty
    db.query(sql, [`%${specialty}%`], (err, result) => {
        if (err) {
            console.error('Error fetching trainers:', err);
            return res.status(500).json({ success: false, message: 'Error fetching trainers.' });
        }

        if (result.length > 0) {
            return res.json({ success: true, trainers: result });
        } else {
            return res.json({ success: true, message: 'No trainers found for this specialty.' });
        }
    });
});

module.exports = router;
