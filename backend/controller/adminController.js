const express = require('expres')
const {User, Servie, Cart} = require('../models')
const bcrypt = require('bcrypt')


exports.allUsers = async(req,res) => {
    try {
        const data = await User.find();
        res.json(data)
    } catch(error) {
        res.status(500).json({
            message:error.message
        })
    }
}