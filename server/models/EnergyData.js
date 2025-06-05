const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const EnergyData = sequelize.define('EnergyData', {
    dataId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'dataId'
    },
    year: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'year'
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'population'
    },
    populationInMillions: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'populationInMillions'
    },
    energyConsumption: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'energyConsumption'
    },
    energyPerCapita: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'energyPerCapita'
    },
    countryId: {
      type: DataTypes.STRING(3),
      allowNull: false,
      field: 'countryId'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userId'
    }
  }, {
    tableName: 'ENERGY_DATA',
    timestamps: false
  });

  EnergyData.associate = function (models) {
    EnergyData.belongsTo(models.Country, {
      foreignKey: 'countryId',
      as: 'country'
    })

    EnergyData.belongsTo(models.AppUser, {
      foreignKey: 'userId',
      as: 'user'
    })
  }

  return EnergyData
}