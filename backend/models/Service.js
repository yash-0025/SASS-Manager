const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serviceSchema = new Schema({
    productId : {
        type: String,
        required: true,
    },
    servicename: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        enum: ["Basic", "Standard", "Elite"],
        required:true
    },
    price: {
        type: Number,
        required: true,
    },
    priceId: {
        type: String,
    },
    duration: {
        type: String,
        enum: ["monthly"],
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Service', serviceSchema);