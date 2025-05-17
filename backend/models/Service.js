const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serviceSchema = new Schema({
    productId : {
        type: String,
        required: true,
    },
    serviceName: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        enum: ["Basic", "Standard", "Elite"]
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
    }
})

module.exports = mongoose.model('Service', serviceSchema);