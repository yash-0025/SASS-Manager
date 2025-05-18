const express = require('expres')
const {User, Servie, Cart} = require('../models')
const bcrypt = require('bcrypt');
const Service = require('../models/Service');


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

exports.allServies = async(req,res) => {
    try{
        const data = await Service.find()
        res.json(data);
    } catch(error) {
        res.status(500).json({
            message:error.message
        })
    }
}