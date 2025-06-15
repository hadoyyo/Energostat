require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateToken } = require('../utils/auth')
const { AppUser, Country } = require('../models')

// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.findAll({
      order: [['countryName', 'ASC']]
    });
    res.status(200).json(countries);
  } catch (error) {
    console.error('/countries - ERROR:', error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, countryId } = req.body
    const errors = {};

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const existingUser = await AppUser.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists." 
      })
    }

    // Check if country exists
    const country = await Country.findOne({ where: { countryId } })
    if (!country) {
      return res.status(400).json({ 
        success: false, 
        message: "Selected country does not exist." 
      })
    }

    // Validate user data
    if (firstName.trim().length < 3) {
      errors.firstName = "First name must be at least 3 characters long."
    }
    if (lastName.trim().length < 3) {
      errors.lastName = "Last name must be at least 3 characters long."
    }
    if (!validateEmail(email.trim())) {
      errors.email = "Please enter a valid email address."
    }
    if (password.trim().length < 6) {
      errors.password = "Password must be at least 6 characters long."
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed",
        errors 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))
    const newUser = await AppUser.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      countryId
    })

    res.status(201).json({ 
      success: true, 
      message: "Registration successful!",
      user: {
        userId: newUser.userId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        countryId: newUser.countryId
      }
    })

  } catch (error) {
    console.error("/register - ERROR:", error.message)
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await AppUser.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      })
    }

    const token = generateToken(user)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    })

    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryId: user.countryId
      }
    })

  } catch (error) {
    console.error("/login - ERROR:", error.message)
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    })
  }
})

// Logout user
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('token')
    res.status(200).json({ 
      success: true, 
      message: "Logout successful" 
    })
  } catch (error) {
    console.error("/logout - ERROR:", error.message)
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    })
  }
})

// Check auth status
router.get('/check-auth', async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(200).json({ isAuthenticated: false })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await AppUser.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Country, as: 'country' }]
    })

    if (!user) {
      return res.status(200).json({ isAuthenticated: false })
    }

    res.status(200).json({ 
      isAuthenticated: true,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryId: user.countryId,
        country: user.country
      }
    })
  } catch (error) {
    console.error("/check-auth - ERROR:", error.message)
    res.status(200).json({ isAuthenticated: false })
  }
})

module.exports = router