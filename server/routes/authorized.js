// server/routes/authorized.js
const express = require('express')
const router = express.Router()
const { verifyToken } = require('../utils/auth')
const { AppUser, EnergyData, Country } = require('../models')

// middleware to verify token
router.use(async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    const decoded = verifyToken(token)
    const user = await AppUser.findByPk(decoded.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error.message)
    res.status(401).json({ success: false, message: "Unauthorized" })
  }
})

// get user data
router.get('/user', async (req, res) => {
  try {
    const user = await AppUser.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Country, as: 'country' }]
    })
    
    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error("/authorized/user - ERROR:", error.message)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

module.exports = router