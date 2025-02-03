const express = require('express')
const mysql =require('mysql2')
const cors = require('cors')
const path =require('path')
const { strictEqual } = require('assert')
const db =require('./config/db')


const app = express()

app.use(express.static(path.join(__dirname,"public")))
app.use(cors())
app.use(express.json())

const port =5000


const UserSignup=require('./routes/createusers')
const Login =require('./routes/login')
const subscriptions=require('./routes/subscriptions')
const addsubscriptions=require('./routes/addsubscription')
const usersubscriptions=require('./routes/usersubscription')
const Trainers =require('./routes/trainers')
const Revenue=require('./routes/revenue')
const Class=require('./routes/class')
app.use("/login",Login)
app.use("/user",UserSignup)
app.use("/subscriptions",subscriptions)
app.use("/addsubscriptions",addsubscriptions)
app.use("/usersubscriptions",usersubscriptions)
app.use("/trainer",Trainers)
app.use("/profit",Revenue)
app.use("/classes",Class)




app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})