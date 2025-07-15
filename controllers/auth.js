const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user.js")




router.get("/" , (req,res) =>{
    res.send("Does is work?")
})

//sign up
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

//sign in
router.get("/sign-in" ,(req,res)=>{
    res.render("auth/sign-in.ejs")
}) 

router.post("/sign-in",async(req,res)=>{
    const userInDB = await User.findOne({username: req.body.username})
    if(!userInDB) {
        return res.send("No username , need to sing-up")
    }
    const validPassword = bcrypt.compareSync(req.body.password, userInDB.password)
    if(!validPassword){
        return res.send("Wrong Password, try again")
    }
    req.session.user = {
        username: userInDB.username,
        _id: userInDB._id,
    }
    res.redirect("/")
})



module.exports =router