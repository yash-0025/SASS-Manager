// const User = require("../models/User")
// const Cart = require("../models/Cart")
// const Service = require("../models/Service")




// exports.getCart = async(req,res) => {
//     try {
//         const data = req.user
//         const user = await User.findOne({
//             email: data.email
//         })
//         let cart = await Cart.findOne({
//             user: user
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

exports.getCart = async (req, res) => {
    try {
        console.log("Fetching cart for user:", req.user._id);
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cart = await Cart.findOne({ user: user._id })
            .populate({
                path: 'items.service',
                model: 'Service',
                select: 'servicename description price duration plan productId priceId'
            });

        if (!cart) {
            console.log("Creating new cart for user");
            cart = new Cart({
                user: user._id,
                items: []
            });
            await cart.save();
        }

        console.log("Cart items:", cart.items);
        res.status(200).json({
            success: true,
            data: cart.items
        });

    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching cart",
            error: error.message
        });
    }
};

exports.addItem = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        let cart = await Cart.findOne({ user: user._id });
        
        if (!cart) {
            cart = new Cart({
                user: user._id,
                items: [{ service: service._id, quantity: 1 }]
            });
        } else {
            const existingItemIndex = cart.items.findIndex(
                item => item.service.toString() === serviceId
            );

            if (existingItemIndex >= 0) {
                cart.items[existingItemIndex].quantity += 1;
            } else {
                cart.items.push({ service: service._id, quantity: 1 });
            }
        }

        await cart.save();
        
        res.status(200).json({
            success: true,
            message: "Service added to cart successfully"
        });
    } catch (error) {
        console.error("Error in addItem:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.service.toString() !== serviceId
        );

        await cart.save();
        
        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully"
        });
    } catch (error) {
        console.error("Error in deleteItem:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const cart = await Cart.findOneAndUpdate(
            { user: user._id },
            { $set: { items: [] } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart emptied successfully"
        });
    } catch (error) {
        console.error("Error in deleteCart:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};