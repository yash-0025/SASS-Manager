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


