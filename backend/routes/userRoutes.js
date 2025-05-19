const express = require('express')
const { getAllUsers, getUserById, updateUserById, deleteUser } = require('../controller/userController')
const router = express.Router()

router.get('/alluser',getAllUsers)
router.get('/user/:id',getUserById)
router.patch('/updateuser/:id', updateUserById)
router.delete('/deleteuser/:id', deleteUser)

module.exports = router