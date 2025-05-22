// require('dotenv').config()

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



// exports.createCustomer = async(req,res) => {
//     try{
//         const customer = await stripe.customers.create({
//             email: req.body.email,
//             name: req.body.email
//         })

//         if(!customer){
//             res.status(500).json({
//                 message: "User with this email not Found"
//             })
//         } else {
//             res.status(200).json({
//                 customerId: customer.id
//             })
//         }
//     } catch(error){
//         res.status(500).json({
//             message : error.message
//         })
//     }
// }

// exports.createSubscription = async(req,res) => {
//     const customerId = req.body.customerId;
//     const priceId = req.body.priceId

//     let priceArray = priceId.map(p =>{return {price:p}})

//     try {
//         const subscription = await stripe.subscriptions.create({
//             customer:customerId,
//             items: priceArray,
//             payment_behavior: 'default_incomplete',
//             payment_settings: {save_default_payment_method:'on_subscription'},
//             expand: ['latest_invoice.payment_intent']
//         })

//         res.send({
//             subscriptionId: subscription.id,
//             clientSecret: subscription.latest_invoice.payment_intent.client_secret
//         })
//     } catch(error) {
//         return res.status(400).send({
//             error: error.message
//         })
//     }
// }

// exports.cancelSubscription = async(req,res) => {
//     try {

//         const deletedSubscription = await stripe.subscriptions.cancel(
//             req.body.subscriptionId
//         )
//          res.send(deletedSubscription)
//     } catch (error) {
//         return  res.status(500).json({
//             message:"Error while cancelling subscription"
//         })
//     }
// }


require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

exports.createCustomer = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if customer already exists
        if (user.stripeCustomerId) {
            return res.status(200).json({
                success: true,
                customerId: user.stripeCustomerId
            });
        }

        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || user.email,
            metadata: {
                userId: user._id.toString()
            }
        });

        if (!customer) {
            return res.status(500).json({
                success: false,
                message: "Failed to create Stripe customer"
            });
        }

        // Save Stripe customer ID to user
        user.stripeCustomerId = customer.id;
        await user.save();

        res.status(200).json({
            success: true,
            customerId: customer.id
        });
    } catch (error) {
        console.error("Error in createCustomer:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createSubscription = async (req, res) => {
    try {
        const { customerId, priceIds } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: priceIds.map(priceId => ({ price: priceId })),
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                userId: user._id.toString()
            }
        });

        res.status(200).json({
            success: true,
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
        });
    } catch (error) {
        console.error("Error in createSubscription:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

        res.status(200).json({
            success: true,
            data: deletedSubscription
        });
    } catch (error) {
        console.error("Error in cancelSubscription:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};