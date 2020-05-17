'use strict';
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class Comment extends Model {}
  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: DataTypes.STRING,
    isactive: DataTypes.TINYINT
  }, { 
    underscored: true,
    sequelize, 
    modelName: 'comment' 
  });  

  return Comment;
};
