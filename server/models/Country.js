const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Country = sequelize.define('Country', {
    countryId: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      field: 'countryId'
    },
    countryName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'countryName'
    },
    flagCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
      field: 'flagCode'
    }
  }, {
    tableName: 'COUNTRY',
    timestamps: false
  });

  Country.associate = function (models) {
    Country.hasMany(models.AppUser, {
      foreignKey: 'countryId',
      as: 'users'
    });
    Country.hasMany(models.EnergyData, {
      foreignKey: 'countryId',
      as: 'data'
    })
  };

  return Country;
};