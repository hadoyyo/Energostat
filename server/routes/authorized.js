const express = require('express')
const router = express.Router()
const { verifyToken } = require('../utils/auth')
const { AppUser, EnergyData, Country, SearchHistory } = require('../models')
const Sequelize = require('sequelize')
const sequelize = require('../config/database')

router.use(async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" })

    const decoded = verifyToken(token)
    const user = await AppUser.findByPk(decoded.userId)
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" })

    req.user = user
    next()
  } catch (error) {
    console.error("Auth error:", error.message)
    res.status(401).json({ success: false, message: "Unauthorized" })
  }
})

router.get('/search-history', async (req, res) => {
  try {
    const history = await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (t) => {
      return await SearchHistory.findAll({
        where: { userId: req.user.userId },
        include: [{
          model: Country,
          as: 'country',
          attributes: ['countryName', 'flagCode']
        }],
        order: [['createdAt', 'DESC']],
        limit: 10,
        transaction: t
      })
    })

    res.status(200).json(history)
  } catch (error) {
    console.error('Search history error:', error.message)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get('/energy-data', async (req, res) => {
  try {
    const { countryId, startYear, endYear } = req.query

    const data = await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (t) => {
      return await EnergyData.findAll({
        where: {
          countryId,
          year: { [Sequelize.Op.between]: [startYear, endYear] }
        },
        order: [['year', 'ASC']],
        include: [{ model: Country, as: 'country' }],
        transaction: t
      })
    })

    if (!data.length) return res.status(404).json([])

    const formatted = data.map(item => ({
      year: item.year,
      country: item.country.countryName,
      population: item.population,
      populationInMillions: item.populationInMillions,
      energyConsumptionTWh: item.energyConsumption,
      energyPerCapitaMWh: item.energyPerCapita
    }))

    res.status(200).json(formatted)
  } catch (error) {
    console.error('Energy data error:', error.message)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post('/energy-data', async (req, res) => {
  try {
    const { countryId, startYear, endYear, data } = req.body

    await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, async (t) => {
      await EnergyData.destroy({
        where: {
          countryId,
          year: { [Sequelize.Op.between]: [startYear, endYear] },
          userId: req.user.userId
        },
        transaction: t
      })

      await Promise.all(data.map(item => 
        EnergyData.create({
          year: item.year,
          countryId,
          userId: req.user.userId,
          population: item.population,
          populationInMillions: item.populationInMillions,
          energyConsumption: item.energyConsumptionTWh,
          energyPerCapita: item.energyPerCapitaMWh
        }, { transaction: t })
      ))
    })

    res.status(201).json({ success: true, message: "Data saved", count: data.length })
  } catch (error) {
    console.error('Save data error:', error.message)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post('/energy-data/history', async (req, res) => {
  try {
    const { countryId, startYear, endYear } = req.body

    await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (t) => {
      await SearchHistory.create({
        countryId,
        startYear,
        endYear,
        userId: req.user.userId
      }, { transaction: t })
    })

    res.status(201).json({ success: true, message: "History saved" })
  } catch (error) {
    console.error('Save history error:', error.message)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get('/user', async (req, res) => {
  try {
    const user = await AppUser.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Country, as: 'country' }]
    })
    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error("User error:", error.message)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

module.exports = router