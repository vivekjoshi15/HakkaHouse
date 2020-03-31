'use strict';
const bcrypt         = require('bcrypt');
const bcrypt_p       = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/util.service');
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  var tb_user = sequelize.define('tb_user', {
    userid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    roleid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    country: DataTypes.STRING,
    phonecode: DataTypes.STRING,
    phone: DataTypes.STRING,
    language: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthday: DataTypes.STRING,
    profileimage: DataTypes.STRING,
    isactive: DataTypes.TINYINT,
    createddate: DataTypes.DATE,
    modifieddate: DataTypes.DATE
  }); 

  tb_user.beforeSave(async (user, options) => {
    let err;
    if (user.changed('password')){
        let salt, hash
        [err, salt] = await to(bcrypt.genSalt(10));
        if(err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(user.password, salt));
        if(err) TE(err.message, true);

        user.password = hash;
      }
  }); 

  tb_user.prototype.comparePassword = async function (pw) {
    let err, pass;
    if (!this.password) TE('password not set');
    
    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if (err) {
      TE(err);
    }

    if (!pass)
      TE('invalid password');

      return this;
  };
  
  tb_user.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    console.log(expiration_time);
    return "Bearer " + jwt.sign({ userid: this.userid }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
  };

  tb_user.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };


  return tb_user;
};
