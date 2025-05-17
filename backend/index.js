const express = require('express')
const dotenv= require('dotenv')
dotenv.config({})
const mongoose = require('mongoose')


const app = express()
app.use(express.json())




// DATABASE CONNECTION
const MONGO_URL = process.env.MONGO_URL;
const PORT= process.env.PORT;


mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error) => {
    console.log(error)
})
mongoose.connection.once('connected', () => {
    console.log("Database connected Successfully")
})


// ROUTES


// SERVER CONNECTION
app.listen(PORT, () => {
    console.log(`Server is up and running on port :: ${PORT} `)
})



