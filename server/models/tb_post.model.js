'use strict';
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  var tb_post = sequelize.define('tb_post', {
    postid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userid: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isprivate: DataTypes.TINYINT,
    isactive: DataTypes.TINYINT,
    createddate: DataTypes.DATE,
    modifieddate: DataTypes.DATE
  }); 

  return tb_post;
};
