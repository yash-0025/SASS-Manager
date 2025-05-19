const express = require('express')
const { allUsers, allServices, allCart } = require('../controller/adminController')
const router = express.Router()


router.get('/allUsers', allUsers)
router.get('/allServices', allServices)
router.get('/allCart', allCart)


module.exports = router