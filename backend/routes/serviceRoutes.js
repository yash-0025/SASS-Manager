const express = require('express')
const { getServices, getPlans, addService, updateService, deleteService } = require('../controller/ServiceController')
const router = express.Router()


router.get('/services',getServices)
router.get('plans/:name',getPlans)
router.post('/addservice',addService)
router.patch('/updateservice/:id',updateService)
router.delete('/deleteservice/:id',deleteService)


module.exports = router