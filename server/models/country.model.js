'use strict';
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class Country extends Model {}
  Country.init({
     id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    sortname: DataTypes.STRING,
    name: DataTypes.STRING,
    phonecode: DataTypes.STRING
  }, { 
    underscored: true,
    timestamps: false,
    sequelize, 
    modelName: 'country' 
  });  

  return Country;
};
