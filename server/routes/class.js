const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/create', (req, res) => {
  const { class_name, description, schedule, trainer_id } = req.body;

  const sql = `
    INSERT INTO classes (class_name, description, schedule, trainer_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [class_name, description, schedule, trainer_id], (err, result) => {
    if (err) {
      console.error('Error creating class:', err);
      return res.status(500).json({ message: 'Failed to create class' });
    }
    return res.status(201).json({ message: 'Class created successfully' });
  });
});

module.exports = router;
