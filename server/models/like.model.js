'use strict';
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class Like extends Model {}
  Like.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    }
  }, { 
    underscored: true,
    sequelize, 
    modelName: 'like' 
  });  

  return Like;
};
