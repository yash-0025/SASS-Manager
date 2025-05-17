require('dotenv').config({path: '../'});
const express = require('express')
const {User} = require("../models/User")
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



exports.signup = async() => {
    
    const data = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        isAdmin:req.body.isadmin,
        isSuperAdmin: req.body.issuperadmin,
    })

    let user = await User.findOne({email: req.body.email});
    if(user) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    try{
        const user = await data.save();
        const payload = {
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin
        }
        const secret = process.env.TOKEN_SECRET
        const jwtToken = jwt.sign(payload,secret);
        success = true
        res.status(200).json({
            success,
            jwtToken
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Error Signing up"
        })
    }

}