const express = require('express')
const {JwtDecoder} = require('../middleware')
const { getCart, deleteCart, addItem, deleteItem } = require('../controller/cartController')
const router = express.Router()



router.get('/cart',JwtDecoder,getCart)
router.post('/emptycart',JwtDecoder,deleteCart)
router.post('/additem/:id',JwtDecoder,addItem)
router.delete('/removeitem/:id',JwtDecoder,deleteItem)


module.exports = router