const express = require('express')
const db = require('../config/db');
const router =express.Router()

router.get('/', (req, res) => {
    const sql = `
      SELECT SUM(sp.price) AS total_revenue
      FROM user_subscriptions us
      JOIN subscriptions sp ON us.plan_id = sp.plan_id
      WHERE us.status = 'active';
    `;
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching total revenue:', err);
        return res.status(500).json({ success: false, message: 'Error fetching total revenue' });
      }
  
      const totalRevenue = result[0].total_revenue || 0; // Handle case where no rows are returned
      return res.json({ success: true, total_revenue: totalRevenue });
    });
  });
  
  module.exports = router;