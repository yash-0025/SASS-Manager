require('dotenv').config();
const { Service } = require("../models/Service")
const { raw } = require('body-parser');


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


exports.getServices = async (req, res) => {
    try {
        const data = await Service.distinct('servicename')
        if (!data) {
            return res.status(500).json({
                message: "Error Connection"
            })
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getPlans = async (req, res) => {
    const name = req.params.name
    try {
        const plans = await Service.find({
            servicename: name
        },
            "servicename plan description price"
        )
        if (!plans) {
            res.status(400).json({
                message: "NO Services found"
            })
        } else {
            res.status(201).json({
                data: plans
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }


    exports.addService = async (req, res) => {
        const { servicename, plan } = req.body;
        const prods = await Service.find({
            servicename: servicename, plan: plan
        })
        if (prods.length > 0) {
            return res.status(409).json("Service already has a plan")
        }
        const product = await stripe.products.create({
            name: req.body.servicename,
            descritption: req.body.description
        })
        if (!product) {
            res.status(500).json({
                message: "Stripe Product creation failed"
            })
        }

        let billingCycle = {
            "monthly": {
                interval: "month",
                interval_count: 1,
            }
        }

        const price = await stripe.prices.create({
            uint_amount: Math.round(Number(req.body.price) * 100),
            currency: 'usd',
            recurring: billingCycle["monthly"],
            product: product.id
        })
        if(!price){
            return res.status(500).json({
                message: "Stripe price Creation error"
            })
        }

        const service = new Service({
            productId: product.id,
            servicename:req.body.servicename,
            description:req.body.description,
            plan:req.body.plan,
            price:req.body.price,
            priceId: req.body.priceId,
            duration: "monthly",
            currency:"usd"
        })

        try {
            const serviceToSave = await service.save();

            res.status(200).json(serviceToSave)
        } catch(error){
            re.status(500).json({
                message: error.message
            })
        }
}

