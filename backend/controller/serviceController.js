require('dotenv').config();
const { default: Stripe } = require('stripe');
const { raw } = require('body-parser');
const Service = require('../models/Service');


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


// exports.getServices = async (req, res) => {
//     try {
//         const data = await Service.distinct('servicename')
//         if (!data) {
//             return res.status(500).json({
//                 message: "Error Connection"
//             })
//         }
//         res.json(data)
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }

exports.getServices = async (req, res) => {
    try {
        // Remove .distinct() to get full documents
        const services = await Service.find({});
        
        if (!services || services.length === 0) {
            return res.status(404).json({
                message: "No services found"
            });
        }
        
        res.json(services); // Return full service objects
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
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
}

    exports.addService = async (req, res) => {
        const { servicename, plan,description } = req.body;
        const prods = await Service.find({
            servicename: servicename, plan: plan
        })
        if (prods.length > 0) {
            return res.status(409).json("Service already has a plan")
        }
        const product = await stripe.products.create({
            name: servicename,
            description: description
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
            unit_amount: Math.round(Number(req.body.price) * 100),
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
            servicename:servicename,
            description:description,
            plan:plan,
            price:req.body.price,
            priceId: req.body.priceId,
            duration: "monthly",
            currency:"usd"
        })

        try {
            const serviceToSave = await service.save();

            res.status(200).json(serviceToSave)
        } catch(error){
            res.status(500).json({
                message: error.message
            })
        }
}


// exports.updateService = async(req,res) => {
//     try{
//         const id = req.params.id;

//         const {productId, servicename, description, plan, price, priceId, duration} = req.body


//         const productUpdate = await stripe.products.update(
//             productId,
//             {
//                 name: servicename,
//                 description: description,
//             }
//         )
//         if(productUpdate) {
//             return res.status(500).json({
//                 message:"Stripe product Update failed!!"
//             })
//         }

//         const result = await Service.findByIdAndUpdate(
//             id, {
//                 productId,
//                 servicename,
//                 description,
//                 plan,
//                 price,
//                 priceId,
//                 duration
//             }
//         )
//         if(!result) {
//             return res.status(500).json({
//                 message: "No updates found"
//             })
//         }
//         res.send(result)
//     } catch(error) {
//         return res.status(500).json({
//             message:error.message
//         })
//     }
// }

exports.updateService = async(req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        // First update Stripe product
        if (updates.productId && (updates.servicename || updates.description)) {
            await stripe.products.update(updates.productId, {
                name: updates.servicename,
                description: updates.description
            });
        }

        // Then update database
        const updatedService = await Service.findByIdAndUpdate(
            id,
            updates,
            { new: true } // Return the updated document
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(updatedService);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// exports.deleteService = async(req,res) => {
//     try {
//         const id = req.params.id;
//         const data = await Service.findByIdAndUpdate(id)
//         res.send(`Document with ${data.name} has been deleted`)
//     } catch(error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }

exports.deleteService = async(req, res) => {
    try {
        const id = req.params.id;
        const service = await Service.findById(id);
        
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Delete from Stripe first
        if (service.productId) {
            await stripe.products.del(service.productId);
        }

        // Then delete from database
        await Service.findByIdAndDelete(id);
        
        res.json({ message: `Service ${service.servicename} deleted successfully` });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}