const express = require('express')
const router =express.Router()
const db = require('../config/db');

router.post('/',(req,res)=>{
    const userId= req.body.user_id;

    const checkSubscriptionSql='SELECT * FROM user_subscriptions WHERE user_id = ?';
    db.query(checkSubscriptionSql,[userId],(err,results)=>{
        if(err){
            console.error("Error Checking existing Subscriptions:",err);
            return res.status(500).json({message:"Something went wrong."});
        }
        console.log("Results from subscription check:", results);
        if(results.length>0){
            return res.status(400).json({message:"You already have a subscription."});
        }
    
    const sql ='INSERT INTO user_subscriptions (user_id,plan_id,start_date,end_date) VALUES(?,?,?,?)'
    const values =[
        req.body.user_id,
        req.body.plan_id,
        req.body.start_date,
        req.body.end_date
    ]

    db.query(sql,values,(err,result)=>{
        if(err){
            console.log(err);
            return res.json({message:"something went wrong:"+err})
        }
        else{
            return res.json({message:"Subscribed to the plan SuccessFully"})
        }
    })
})
})
// I can add the get method here for the admin to see how many people are taking the Plans 
module.exports = router