const express = require('express')
const dotenv= require('dotenv')
dotenv.config({path: './.env'})
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.set("strictQuery", false)

// ROUTES IMPORTS
const authRoutes = require("./routes/authRoutes.js")
const adminRoutes = require("./routes/adminRoutes.js")
const cartRoutes = require("./routes/cartRoute.js")
const paymentRoutes = require("./routes/paymentRoutes.js")
const serviceRoutes = require("./routes/serviceRoutes.js")
const userRoutes = require("./routes/userRoutes.js")

const app = express()
app.use(cors())
app.use(express.json())




// DATABASE CONNECTION
const MONGO_URL = process.env.MONGO_URL;
const port= process.env.PORT || 5000;


mongoose.connect(MONGO_URL);
mongoose.connection.on('connected', () => {
    console.log("Database Connected Successfully...");
})


// ROUTES
app.use('/',authRoutes)
app.use('/api',userRoutes)
app.use('/api',serviceRoutes)
app.use('/api',adminRoutes)
app.use('/api',cartRoutes)
app.use('/api/payment',paymentRoutes)


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


// SERVER CONNECTION
app.listen(port, () => {
    console.log(`Server is up and running on port :: ${port} `)
})



