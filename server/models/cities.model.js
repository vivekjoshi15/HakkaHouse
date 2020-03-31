'use strict';
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  var cities = sequelize.define('cities', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    state_id: DataTypes.INTEGER
  }); 

  return cities;
};
