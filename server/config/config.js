require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.NODE_ENV   || 'development';
CONFIG.port         = process.env.PORT  || '5000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'l7cup2om0gngra77.cbetxkdyhwsb.us-east-1.rds.amazonaws.com'; //hakka-house:us-central1:hakkahouse-db
CONFIG.db_port      = process.env.DB_PORT       || '3306';         //3306
CONFIG.db_name      = process.env.DB_NAME       || 'pyzqf7iee1xfppkt'; //hakkahouseDB
CONFIG.db_user      = process.env.DB_USER       || 'vjd1gvheo221zek5';         //root
CONFIG.db_password  = process.env.DB_PASSWORD   || 'mjmtmz9n9326n1pu'; //hakkahouse!1

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'supersecret';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '100000000';

module.exports = CONFIG;