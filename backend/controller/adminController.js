const User = require('../models/User')
const Cart = require('../models/Cart')
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

exports.allServices = async(req,res) => {
    try{
        const data = await Service.find()
        res.json(data);
    } catch(error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.allCart = async(req,res) => {
    try{
        const data = await Cart.find().populate('user');
        res.json(data)
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}

