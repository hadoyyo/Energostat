const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {
  AppUser: require('./AppUser')(sequelize),
  Country: require('./Country')(sequelize),
  EnergyData: require('./EnergyData')(sequelize),
  SearchHistory: require('./SearchHistory')(sequelize)
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
    console.log('Models synchronized.');
  } catch (error) {
    console.error('Models synchronization failed:', error);
  }
}

module.exports = {
  sequelize,
  Sequelize,
  ...models,
  syncModels
};