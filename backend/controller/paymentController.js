require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



exports.createCustomer = async(req,res) => {
    try{
        const customer = await stripe.customers.create({
            email: req.body.email,
            name: req.body.email
        })

        if(!customer){
            res.status(500).json({
                message: "User with this email not Found"
            })
        } else {
            res.status(200).json({
                customerId: customer.id
            })
        }
    } catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}