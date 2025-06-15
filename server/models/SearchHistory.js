const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SearchHistory = sequelize.define('SearchHistory', {
    searchId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'searchId'
    },
    countryId: {
      type: DataTypes.STRING(3),
      allowNull: false,
      field: 'countryId'
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'startYear'
    },
    endYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'endYear'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'createdAt'
    }
  }, {
    tableName: 'SEARCH_HISTORY',
    timestamps: false
  });

  SearchHistory.associate = function (models) {
    SearchHistory.belongsTo(models.AppUser, {
      foreignKey: 'userId',
      as: 'user'
    });
    SearchHistory.belongsTo(models.Country, {
      foreignKey: 'countryId',
      as: 'country'
    });
  };

  return SearchHistory;
};