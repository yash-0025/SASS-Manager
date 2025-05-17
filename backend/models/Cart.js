const mongoose = require('mongoose')
const Schema = mongoose.Schema



const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
})

module.exports = mongoose.model('Cart', cartSchema)