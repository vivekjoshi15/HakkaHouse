'use strict';
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  var countries = sequelize.define('countries', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    sortname: DataTypes.STRING,
    name: DataTypes.STRING,
    phonecode: DataTypes.STRING
  }); 

  return countries;
};
