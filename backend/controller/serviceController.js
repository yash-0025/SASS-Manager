require('dotenv').config();
const {Service} = require("../models/Service")
const {raw} = require('body-parser');
const gateway = require('../routes/paypalRoute')


exports.getServices = async(req,res) => {
    try {
        const data = await Service.distinct('servicename')
        if(!data) {
            return res.status(500).json({
                message: "Error Connection"
            })
        }
        res.json(data)
    } catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getPlans = async(req,res) => {
    const name = req.params.name
    try{
        const plans = await Service.find({
            servicename: name
        },
    "servicename plan description price"
    )
    if(!plans) {
        res.status(400).json({
            message: "NO Services found"
        })
    } else {
        res.status(201).json({
            data: plans
        })
    }
    } catch(error){
        res.status(500).json(error)
    }
}