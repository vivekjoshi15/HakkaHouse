'use strict';
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class City_Info extends Model {}
  City_Info.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    description: DataTypes.STRING
  }, { 
    underscored: true,
    sequelize, 
    modelName: 'city_info' 
  });  

  return City_Info;
};
