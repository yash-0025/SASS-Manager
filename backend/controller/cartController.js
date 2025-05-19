const {User, Cart, Service} = require('../models')
const {JwtDecoder} = require('../middleware/index')


exports.getCart = async(req,res) => {
    try {
        const data = req.user
        const user = await User.findOne({
            email: data.email
        })
        let cart = await Cart.findOne({
            user: user
        }).populate('items')
        if(!cart) {
            const new_cart = new Cart({
                user: user
            });
            cart = await new_cart.save()
        }
        res.status(201).json({
            data: cart.items
        })
    } catch(error) {
        res.status(400).json({
            message:error.message
        })
    }
}


