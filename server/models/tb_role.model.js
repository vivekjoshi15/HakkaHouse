'use strict';
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  var tb_role = sequelize.define('tb_role', {
    roleid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    rolename: DataTypes.STRING
  }); 

  return tb_role;
};
