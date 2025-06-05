require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

require('./config/database')
require('./models/index')

const commonRoute = require('./routes/common')
// const authorizedRoute = require('./routes/authorized')

//middleware
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// routes
app.use('/api/common', commonRoute)
// app.use('/api/authorized', authorizedRoute)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server is working on PORT: ${port}`))