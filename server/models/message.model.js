'use strict';
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class Message extends Model {}
  Message.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    isactive: DataTypes.TINYINT,
    isread: DataTypes.TINYINT,
    message: DataTypes.STRING,
    readdate: DataTypes.DATE
  }, { 
    underscored: true,
    sequelize, 
    modelName: 'message' 
  });  

  return Message;
};
