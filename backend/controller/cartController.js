const {User, Cart, Service} = require('../models')



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


exports.deleteCart = async(req,res) => {
    try {
        const data = req.user
        const user = await User.findOne({
            email: data.email
        })
        let cart = await Cart.findOne({
            user: user
        })
        cart.items = []

        const resp = await cart.save()
        res.status(201).json({
            message: "Cart Emptied successfully"
        })
    } catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}


exports.addItem = async(req,res) => {
    try{
        const data = req.user
        const prod = req.params.id
        const service = await Service.findOne({
            _id: prod
        })
        const user = await User.findOne({
            email: data.email
        })
        let cart = await Cart.findOne({
            user: user
        })
        if(!cart) {
            const new_cart = new Cart({
                user: user
            })
            cart = await new_cart.save()
        }

        if(cart.items.includes(service)) {
            return res.status(400).json({
                message: "Service already added"
            })
        }

        let items = cart.items
        if(items.indexOf(prod) === -1) {
            items.push(service)
            cart.items = items
            const result = await cart.save()
            res.status(200).json({
                message: "Successfully Service Added to cart"
            })
        } else {
            return res.status(200).json({
                message:"Service already added in the cart"
            })
        }
    }catch(error) {
        res.status(400).json({
            message:error.message
        })
    }
}


exports.deleteItem = async(req,res) => {
    try {
        const data = req.user
        const prod = req.params.id
        const service = await Service.findOne({_id:prod})
        const user = await User.findOne({
            email: data.email
        })
        let cart = await Cart.findOne({
            user:user
        })

        let items = cart.items
        items = items.filter(it => it != prod)
        cart.items = items
        const result = await cart.save()
        res.status(201).json({
            message: "Item Deleted"
        })
    } catch(error){
        res.status(500).json(error)
    }
}