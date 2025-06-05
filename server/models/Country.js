const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Country = sequelize.define('Country', {
    countryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'countryId'
    },
    countryName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'countryName'
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
  };

  return Country;
};