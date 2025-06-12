// server/routes/authorized.js
const express = require('express')
const router = express.Router()
const { verifyToken } = require('../utils/auth')
const { AppUser, EnergyData, Country, SearchHistory } = require('../models')
const Sequelize = require('sequelize');

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

// Get user's search history
router.get('/search-history', async (req, res) => {
  try {
    const history = await SearchHistory.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: Country,
          as: 'country',
          attributes: ['countryName', 'flagCode']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('/authorized/search-history - ERROR:', error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get energy data for specific country and year range
router.get('/energy-data', async (req, res) => {
  try {
    const { countryId, startYear, endYear } = req.query;
    
    const data = await EnergyData.findAll({
      where: {
        countryId,
        year: {
          [Sequelize.Op.between]: [startYear, endYear]
        }
      },
      order: [['year', 'ASC']],
      include: [{
        model: Country,
        as: 'country'
      }]
    });

    if (data.length === 0) {
      return res.status(404).json([]);
    }

    const formattedData = data.map(item => ({
      year: item.year,
      country: item.country.countryName,
      population: item.population,
      populationInMillions: item.populationInMillions,
      energyConsumptionTWh: item.energyConsumption,
      energyPerCapitaMWh: item.energyPerCapita
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('/authorized/energy-data - ERROR:', error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Save energy data to database
router.post('/energy-data', async (req, res) => {
  try {
    const { countryId, startYear, endYear, data } = req.body;
    const userId = req.user.userId;

    // First delete any existing data for this range to avoid duplicates
    await EnergyData.destroy({
      where: {
        countryId,
        year: {
          [Sequelize.Op.between]: [startYear, endYear]
        },
        userId
      }
    });

    // Save new data
    const savedData = await Promise.all(data.map(item => 
      EnergyData.create({
        year: item.year,
        countryId,
        userId,
        population: item.population,
        populationInMillions: item.populationInMillions,
        energyConsumption: item.energyConsumptionTWh,
        energyPerCapita: item.energyPerCapitaMWh
      })
    ));

    // Save search history
    await SearchHistory.create({
      countryId,
      startYear,
      endYear,
      userId
    });

    res.status(201).json({ 
      success: true, 
      message: "Data saved successfully",
      count: savedData.length
    });
  } catch (error) {
    console.error('/authorized/energy-data - ERROR:', error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

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