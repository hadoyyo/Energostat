require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'energostat_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'RootPassword123!',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

async function connection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database completed successfully.');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}
connection();

module.exports = sequelize;