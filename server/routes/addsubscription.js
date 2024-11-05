const express = require('express')
const router =express.Router()
const db = require('../config/db');

router.post('/',(req,res)=>{
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
// I can add the get method here for the admin to see how many people are taking the Plans 
module.exports = router