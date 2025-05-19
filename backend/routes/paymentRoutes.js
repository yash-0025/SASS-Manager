const express = require('express')
const { createCustomer, createSubscription, cancelSubscription } = require('../controller/paymentController')
const router = express.Router()

router.post('/create-customer', createCustomer)
router.post('/create-subscriptions',createSubscription)
router.post('/cancel-subscription', cancelSubscription)

module.exports = router
