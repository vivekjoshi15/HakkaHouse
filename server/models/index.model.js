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
  operatorsAliases: false,
  //port: CONFIG.db_port,
  //username: CONFIG.db_user,
  //password: CONFIG.db_password,
  //timestamps: false,
  //dialectOptions: {
  //  socketPath: CONFIG.db_host
  //}
});

fs
  .readdirSync( __dirname )
  .filter( function( file ) {    
    return ( file.indexOf( '.' ) !== 0 ) && ( file !== basename ) && ( file.slice( -3 ) === '.js' )
  } )
  .forEach( function( file ) {
    var model = sequelize['import']( path.join( __dirname, file ) )
    db[model.name] = model
  });

/*Object.keys(db).forEach( function(modelName) {
  
  if ( db[modelName].associate ) {
    db[modelName].associate(db)
  }
});*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Models/tables
db.country = require('./country.model.js')(sequelize, Sequelize);
db.state = require('./state.model.js')(sequelize, Sequelize);
db.city = require('./city.model.js')(sequelize, Sequelize);
db.city_info = require('./city_info.model.js')(sequelize, Sequelize);

db.role = require('./role.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);
db.post = require('./post.model.js')(sequelize, Sequelize);
db.like = require('./like.model.js')(sequelize, Sequelize);
db.message = require('./message.model.js')(sequelize, Sequelize);
db.comment = require('./comment.model.js')(sequelize, Sequelize);

db.country.hasMany(db.state, { as: "states",
  foreignKey: {
    allowNull: false
  }
});
db.state.belongsTo(db.country, { as: "country",
  foreignKey: {
    allowNull: false
  }
});

db.state.hasMany(db.city, { as: "cities",
  foreignKey: {
    allowNull: false
  }
});
db.city.belongsTo(db.state, { as: "state",
  foreignKey: {
    allowNull: false
  }
});

db.city_info.belongsTo(db.city, { as: "city", foreignKey: {
    allowNull: false
  } 
});

db.role.hasMany(db.user, { as: "users",
  foreignKey: {
    allowNull: false
  }
});
db.user.belongsTo(db.role, { as: "role",
  foreignKey: {
    allowNull: false
  }
});
db.user.hasMany(db.post, { as: "posts",
  foreignKey: {
    allowNull: false
  }
});
db.post.belongsTo(db.user, { as: "user",
  foreignKey: {
    allowNull: false
  }
});

db.post.hasMany(db.like, { as: "likes",
  foreignKey: {
    allowNull: false
  }
});
db.like.belongsTo(db.post, { as: "post",
  foreignKey: {
    allowNull: false
  }
});
db.user.hasMany(db.like, { as: "likes",
  foreignKey: {
    allowNull: false
  }
});
db.like.belongsTo(db.user, { as: "user",
  foreignKey: {
    allowNull: false
  }
});

db.post.hasMany(db.comment, { as: "comments",
  foreignKey: {
    allowNull: false
  }
});
db.comment.belongsTo(db.post, { as: "post",
  foreignKey: {
    allowNull: false
  }
});
db.user.hasMany(db.comment, { as: "comments",
  foreignKey: {
    allowNull: false
  }
});
db.comment.belongsTo(db.user, { as: "user",
  foreignKey: {
    allowNull: false
  }
});

db.user.hasMany(db.message, { as: "messages",
  foreignKey: {
    allowNull: false
  }
});
db.message.belongsTo(db.user, { as: "user",
  foreignKey: {
    allowNull: false
  }
});
db.user.hasMany(db.message, { as: "sender_messages", foreignKey: { name:'sender_id', allowNull: false } });

module.exports = db