'use strict';
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class City extends Model {}
  City.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, { 
    underscored: true,
    timestamps: false,
    sequelize, 
    modelName: 'city' 
  }); 

  return City;
};
