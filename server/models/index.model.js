'use strict';
const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const env       = process.env.NODE_ENV || 'development'
const db        = {};
const CONFIG = require('../config/config');

const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
  host: CONFIG.db_host,
  dialect: CONFIG.db_dialect,
  //port: CONFIG.db_port,
  //username: CONFIG.db_user,
  //password: CONFIG.db_password,
  //timestamps: false,
  //dialectOptions: {
  //  socketPath: CONFIG.db_host
  //}
  operatorsAliases: false
});

fs
  .readdirSync( __dirname )
  .filter( function( file ) {    
    return ( file.indexOf( '.' ) !== 0 ) && ( file !== basename ) && ( file.slice( -3 ) === '.js' )
  } )
  .forEach( function( file ) {
    var model = sequelize['import']( path.join( __dirname, file ) )
    db[ model.name ] = model
  });

Object.keys( db ).forEach( function(modelName) {
  
  if ( db[modelName].associate ) {
    db[modelName].associate( db )
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Models/tables
/*db.tb_post = require('./tb_post.model.js')(sequelize, Sequelize);

db.tb_post.belongsTo(db.tb_user);
db.tb_user.hasMany(db.tb_post);*/

module.exports = db