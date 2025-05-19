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

exports.createSubscription = async(req,res) => {
    const customerId = req.body.customerId;
    const priceId = req.body.priceId

    let priceArray = priceId.map(p =>{return {price:p}})

    try {
        const subscription = await stripe.subscriptions.create({
            customer:customerId,
            items: priceArray,
            payment_behavior: 'default_incomplete',
            payment_settings: {save_default_payment_method:'on_subscription'},
            expand: ['latest_invoice.payment_intent']
        })

        res.send({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
        })
    } catch(error) {
        return res.status(400).send({
            error: error.message
        })
    }
}