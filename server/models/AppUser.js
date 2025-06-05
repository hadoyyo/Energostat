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
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'countryId'
    },
    created_at: {
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
  };

  return AppUser;
};