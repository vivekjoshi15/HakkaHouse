'use strict';

const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {

  class Role extends Model {}
  Role.init({
     id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: dataTypes.STRING
  }, { 
    underscored: true,
    sequelize, 
    modelName: 'role' 
  });

  return Role;
};
