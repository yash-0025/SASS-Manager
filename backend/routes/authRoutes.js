const { signup, login } = require("../controller/auth")

const express = requie('express')
const router = express.Router()


router.post('/signup', signup)
router.post('/login',login)

module.exports = router