const express =require('express')
const router =express.Router()
const db = require('../config/db');

router.post('/',(req,res)=>{
    const sql = "INSERT INTO users (name, email, password, phone, address, role, created_at) VALUES (?, ?, hash_password(?), ?, ?,?, NOW())";
const values = [
    req.body.name,
    req.body.email,
    req.body.password, // Remember to hash the password
    req.body.phone,
    req.body.address,
    req.body.role
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

router.get('/',(req,res)=>{
   const sql = "SELECT * FROM users"

   db.query(sql,(err,results)=>{
    if(err){
        console.error("Error Fetching Users :",err);
        return res.status(500).json({message:"Something Went Wrong",error:err})
    }else{
        return res.status(200).json({message :"Users retrieved successfully", users: results});
    }
   })
})

router.delete('/delete-user/:userId',(req,res)=>{
    const userId=req.params.userId

    const sql ='SELECT role FROM users WHERE user_id = ?';
    db.query(sql,[userId],(err,results) => {
        if(err){
            console.error("Error checking user role:", err);
            return res.status(500).json({ message: "Internal server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const delteUsersql = 'DELETE FROM users WHERE user_id= ?';
        db.query(delteUsersql, [userId], (err, results) => {
            if (err) {
                console.error("Error deleting user:", err);
                return res.status(500).json({ message: "Error deleting user." });
            }
            res.status(200).json({ message: "User deleted successfully, along with any associated trainer record if applicable." });
    })
})
})

router.put('/change-username', (req, res) => {
    const { user_id, new_name } = req.body;

    // Validate input data
    if (!user_id || !new_name) {
        return res.status(400).json({ success: false, message: 'User ID and new name are required' });
    }

    // SQL query to update the user's name
    const sql = `
        UPDATE users 
        SET name = ? 
        WHERE user_id = ?;
    `;

    // Execute the query
    db.query(sql, [new_name, user_id], (err, result) => {
        if (err) {
            console.error('Error updating username:', err);
            return res.status(500).json({ success: false, message: 'Error updating username' });
        }

        // Check if any row was affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Respond with success
        return res.json({ success: true, message: 'Username updated successfully' });
    });
});

module.exports=router