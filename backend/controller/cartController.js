// const User = require("../models/User")
// const Cart = require("../models/Cart")
// const Service = require("../models/Service")




// exports.getCart = async(req,res) => {
//     try {
//         const data = req.user
//         console.log(data)
//         const user = await User.findOne({
//             email: data.email
//         })
//         let cart = await Cart.findOne({
//             user: user._id
//         }).populate('items')
//         if(!cart) {
//             const new_cart = new Cart({
//                 user: user
//             });
//             cart = await new_cart.save()
//         }
//         res.status(201).json({
//             data: cart.items
//         })
//     } catch(error) {
//         res.status(400).json({
//             message:error.message
//         })
//     }
// }


// exports.deleteCart = async(req,res) => {
//     try {
//         const data = req.user
//         const user = await User.findOne({
//             email: data.email
//         })
//         let cart = await Cart.findOne({
//             user: user
//         })
//         cart.items = []

//         const resp = await cart.save()
//         res.status(201).json({
//             message: "Cart Emptied successfully"
//         })
//     } catch(error){
//         res.status(400).json({
//             message:error.message
//         })
//     }
// }


// exports.addItem = async(req,res) => {
//     try{
//         const data = req.user
//         const prod = req.params.id
//         const service = await Service.findOne({
//             _id: prod
//         })
//         const user = await User.findOne({
//             email: data.email
//         })
//         let cart = await Cart.findOne({
//             user: user
//         })
//         if(!cart) {
//             const new_cart = new Cart({
//                 user: user
//             })
//             cart = await new_cart.save()
//         }

//         if(cart.items.includes(service)) {
//             return res.status(400).json({
//                 message: "Service already added"
//             })
//         }

//         let items = cart.items
//         if(items.indexOf(prod) === -1) {
//             items.push(service)
//             cart.items = items
//             const result = await cart.save()
//             res.status(200).json({
//                 message: "Successfully Service Added to cart"
//             })
//         } else {
//             return res.status(200).json({
//                 message:"Service already added in the cart"
//             })
//         }
//     }catch(error) {
//         res.status(400).json({
//             message:error.message
//         })
//     }
// }


// exports.deleteItem = async(req,res) => {
//     try {
//         const data = req.user
//         const prod = req.params.id
//         const service = await Service.findOne({_id:prod})
//         const user = await User.findOne({
//             email: data.email
//         })
//         let cart = await Cart.findOne({
//             user:user
//         })

//         let items = cart.items
//         items = items.filter(it => it != prod)
//         cart.items = items
//         const result = await cart.save()
//         res.status(201).json({
//             message: "Item Deleted"
//         })
//     } catch(error){
//         res.status(500).json(error)
//     }
// }


const User = require("../models/User");
const Cart = require("../models/Cart");
const Service = require("../models/Service");
const mongoose = require("mongoose");

// @desc    Get user's cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cart = await Cart.findOne({ user: user._id }).populate({
            path: 'items.service',
            model: 'Service',
            select: 'servicename description price duration plan productId priceId'
        });

        if (!cart) {
            cart = new Cart({ user: user._id, items: [] });
            await cart.save();
        }

        res.status(200).json({ success: true, data: cart.items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add/:id
exports.addItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const serviceId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ success: false, message: "Service not found" });

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart = new Cart({ user: user._id, items: [{ service: service._id, quantity: 1 }] });
        } else {
            const existingItem = cart.items.find(item =>
                item.service.toString() === service._id.toString()
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ service: service._id, quantity: 1 });
            }
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Service added to cart successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete item from cart
// @route   DELETE /api/cart/item/:id
exports.deleteItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const serviceId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const originalLength = cart.items.length;
        cart.items = cart.items.filter(item => item.service.toString() !== serviceId);

        if (cart.items.length === originalLength) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Empty the cart
// @route   DELETE /api/cart
exports.deleteCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const cart = await Cart.findOneAndUpdate(
            { user: user._id },
            { $set: { items: [] } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        res.status(200).json({ success: true, message: "Cart emptied successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
