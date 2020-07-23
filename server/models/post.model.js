'use strict';

const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {

  class Post extends Model {}
  Post.init({
     id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: DataTypes.TEXT('long'),
    type: DataTypes.STRING,
    videotype: DataTypes.STRING,
    isprivate: DataTypes.TINYINT,
    isactive: DataTypes.TINYINT
  }, { 
    underscored: true,
    sequelize, 
    modelName: 'post' 
  });

  return Post;
};
