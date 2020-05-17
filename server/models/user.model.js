'use strict';
const bcrypt         = require('bcrypt');
const bcrypt_p       = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/util.service');
const CONFIG = require('../config/config');
const { Sequelize, Model, DataTypes, BuildOptions } = require('sequelize');

module.exports = (sequelize, dataTypes) => {
  class User extends Model {}
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
    fullname: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstname} ${this.lastname}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    }
  }, { 
    underscored: true,
    sequelize, 
    modelName: 'user' 
  });

  User.beforeSave(async (user, options) => {
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

  User.prototype.comparePassword = async function (pw) {
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
  
  User.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    console.log(expiration_time);
    return "Bearer " + jwt.sign({ id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
  };

  User.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };


  return User;
};
