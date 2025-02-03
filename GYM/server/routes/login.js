const express =require('express')
const router =express.Router()
const db = require('../config/db');
const crypto = require('crypto');

router.post('/', (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    // Check if the user exists in the database
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        const user = results[0];

        // Directly compare passwords
        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        
        // Successful login
        res.json({ message: 'Login successful', user });
    });
});

module.exports = router;