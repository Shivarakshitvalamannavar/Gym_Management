const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.post('/', (req, res) => {
    const userId = req.body.user_id;
    const sql = `
        SELECT subscriptions.plan_id, subscriptions.name, subscriptions.description, subscriptions.price, subscriptions.duration,
               user_subscriptions.start_date, user_subscriptions.end_date
        FROM user_subscriptions
        JOIN subscriptions ON user_subscriptions.plan_id = subscriptions.plan_id
        WHERE user_subscriptions.user_id = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user subscriptions:", err);
            return res.status(500).json({ message: "Something went wrong: " + err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No subscriptions found for this user." });
        }
        return res.status(200).json({ subscriptions: results });
    });
});

module.exports =router 