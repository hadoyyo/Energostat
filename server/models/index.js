const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// import models
const Country = require('./Country');
const AppUser = require('./AppUser');

// initialize models
const models = {
  Country: Country(sequelize),
  AppUser: AppUser(sequelize)
};

// set relations
Object.keys(models).forEach(modelName => {
  if (typeof models[modelName].associate === 'function') {
    models[modelName].associate(models);
  }
});

// synchronize relations
async function syncModels(options = { alter: true }) {
  try {
    await sequelize.sync(options);
    console.log('Modele zsynchronizowane pomyślnie');
  } catch (error) {
    console.error('Błąd synchronizacji modeli:', error);
  }
}

module.exports = {
  sequelize,
  Sequelize,
  ...models,
  syncModels
};