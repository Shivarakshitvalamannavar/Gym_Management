const express =require('express')
const router =express.Router()
const db = require('../config/db');

router.post('/',(req,res)=>{
    const sql = "INSERT INTO users (name, email, password, phone, address, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
const values = [
    req.body.name,
    req.body.email,
    req.body.password, // Remember to hash the password
    req.body.phone,
    req.body.address,
];

// Insert into users table
db.query(sql, values, (err, result) => {
    if (err) {
        console.log(err);
        return res.json({ message: 'Something has happened: ' + err });
    }

    // Get the new user_id
    const user_id = result.insertId;

    // Check if role is trainer
    if (req.body.role === 'trainer') {
        const trainerSql = "INSERT INTO trainers (user_id, specialty, bio, rate) VALUES (?, ?, ?, ?)";
        const trainerValues = [
            user_id,
            req.body.specialty,
            req.body.bio,
            req.body.rate,
        ];

        // Insert into trainers table
        db.query(trainerSql, trainerValues, (trainerErr, trainerResult) => {
            if (trainerErr) {
                console.log(trainerErr);
                return res.json({ message: 'Error adding trainer: ' + trainerErr });
            }

            return res.json({
                success: "Trainer registered successfully",
                user_id: user_id,
            });
        });
    } else {
        // If not a trainer, just respond with success
        return res.json({ success: "User added successfully", user_id: user_id });
    }
});
})

module.exports=router