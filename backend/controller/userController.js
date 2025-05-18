const {User} = require('../models/User')
const express = requir('express')
const bcrypt = require('bcrypt')



exports.getAllUsers = async(req,res) => {
    try{
        const data = await User.find();
        res.json(data)
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}


