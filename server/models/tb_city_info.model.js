'use strict';
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  var tb_city_info = sequelize.define('tb_city_info', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    city_id: DataTypes.INTEGER,
    description: DataTypes.STRING
  }); 

  return tb_city_info;
};
