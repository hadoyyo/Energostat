require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { AppUser, Country } = require('../models')


// test
router.get('/test', async (req, res) => {
  try {
    console.log('/test - SUCCESS')
    res.status(200).json({ success: true, message: "Works!" })
  } catch (error) {
    console.error('/test - ERROR')
    res.status(500).json({ success: false, message: "Internal server error." })
  }
})


// create new account
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, countryId } = req.body
    const error = {};

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    // check if user exists
    const existingUser = await AppUser.findOne({ where: { email: email } })
    if (existingUser) {
      return res.json({ success: false, message: "User with this email already exists." })
    }

    // check if country exists
    const country = await Country.findOne({ where: { countryId: countryId } })
    if (!country) {
      return res.json({ success: false, message: "Country does not exist." })
    }

    // validate user data
    if (firstName.trim().length < 3) {
      error[firstName] = "First name is too short."
    }
    if (lastName.trim().length < 3) {
      error[lastName] = "Last name is too short."
    }
    if (!validateEmail(email.trim())) {
      error[email] = "Email is invalid."
    }
    if (password.trim().length < 6) {
      error[password] = "Password is too short."
    }

    // check errors
    if (Object.keys(error).length > 0) {
      return res.status(400).json({ success: false, message: error })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))
    const newUser = await AppUser.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      countryId
    })

    // TODO: remove newUser from response (it contains hashedPassword)
    console.log("/register - SUCCESS")
    res.status(201).json({ success: true, message: "User created successfully.", user: newUser })

  } catch (error) {
    console.error("/register - ERROR:", error.message)
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message })
  }
})

module.exports = router