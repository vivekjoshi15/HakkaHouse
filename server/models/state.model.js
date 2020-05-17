'use strict';
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class State extends Model {}
  State.init({
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
    modelName: 'state' 
  });  

  return State;
};
