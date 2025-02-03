const express= require('express')
const router = express.Router()
const db = require('../config/db')

router.post('/',(req,res)=>{
    const sql = "INSERT INTO subscriptions (name,duration,price,description) VALUES(?,?,?,?)";
    const values =[
        req.body.name,
        req.body.duration,
        req.body.price,
        req.body.description
    ]

db.query(sql,values,(err,result)=>{
    if(err){
        console.log(err);
        return res.json({ message:"something went wrong: "+ err})
    }

    else{
        return res.json({message:"Plan Added SuccesFully :"})
    }
})
})
router.get('/',(req,res)=>{
    const sql= "SELECT * FROM subscriptions"

    db.query(sql,(err,results) =>{
        if(err){
            console.error("Error Fecthing Plans:",err);
            return res.status(500).json({message:"Something Went Wrong",error:err})
        }else{
            return res.status(200).json({ message: "Subscriptions retrieved successfully", subscriptions: results });
        }
    })
})

module.exports = router