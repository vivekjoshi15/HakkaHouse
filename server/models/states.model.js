'use strict';
const CONFIG = require('../config/config');
const model = require('./index.model');

module.exports = (sequelize, DataTypes) => {
  var states = sequelize.define('states', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    country_id: DataTypes.INTEGER
  }); 


  //states.country = states.belongsTo(model.countries, {foreignKey: 'country_id'})
  //model.countries.states=model.countries.hasMany(states, {foreignKey: 'country_id'})

  return states;
};
