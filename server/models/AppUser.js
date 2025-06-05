const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppUser = sequelize.define('AppUser', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'userId'
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'firstName'
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'lastName'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      field: 'email'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password'
    },
    countryId: {
      type: DataTypes.STRING(3),
      allowNull: true,
      field: 'countryId'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'createdAt'
    }
  }, {
    tableName: 'APP_USER',
    timestamps: false
  });

  AppUser.associate = function (models) {
    AppUser.belongsTo(models.Country, {
      foreignKey: 'countryId',
      as: 'country'
    });
    AppUser.belongsTo(models.EnergyData, {
      foreignKey: 'dataId',
      as: 'data'
    })
  };

  return AppUser;
};