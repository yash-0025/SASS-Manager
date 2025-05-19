const express = require('express')
const { allUsers, allServices, allCart } = require('../controller/adminController')
const router = express.Router()


router.get('/allusers', allUsers)
router.get('/allservices', allServices)
router.get('/allcart', allCart)


module.exports = router