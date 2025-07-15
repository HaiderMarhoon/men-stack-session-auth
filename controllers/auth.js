const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user.js")




router.get("/" , (req,res) =>{
    res.send("Does is work?")
})

router.get("/sign-up" ,(req,res) =>{
    res.render("auth/sign-up.ejs")
})


//post to the db
router.post("/sign-up", async(req,res) =>{
    console.log(req.body)
    const userInDB = await User.findOne({username: req.body.username})
    if(userInDB) {
        return res.send("user name is taken")
    }
    if(req.body.password !== req.body.confirmPassword){
        return res.send("password and confirmPassword are diff")
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    const newUser = await User.create(req.body)
    res.send(`thanks for sign up ${newUser.username}`)
})



module.exports =router