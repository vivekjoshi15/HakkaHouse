const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const multer = require('multer')

const CONFIG = require('./server/config/config');

const v1 = require('./server/routes/v1');

const app = express();

// enhance your app security with Helmet
app.use(helmet());

// log HTTP requests
app.use(logger('combined'));
//app.use(logger('dev'));

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 10mb.
    fileSize: 10 * 1024 * 1024,
  },
})
app.use(multerMid.single('file'))

// use bodyParser to parse application/json content-type
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

const port = process.env.PORT || 5000;

//Passport
app.use(passport.initialize());
require('./server/middleware/passport')(passport);

//Log Env
console.log("Environment:", CONFIG.app);

//DATABASE
const models = require("./server/models/index.model");
models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
}).catch(err => {
        console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
});

if (CONFIG.app === 'development') {
   models.sequelize.sync();//creates table if they do not already exist
   //models.sequelize.sync({ force: true });//deletes all tables then recreates them useful for testing and development purposes
}

// enable all CORS requests
app.use(cors());
app.use('/v1', v1);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, './client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    //res.sendFile(path.join(__dirname+'../client/build/index.html'));
    //res.sendFile('../client/build/index.html', {root: __dirname});
    res.sendFile('./client/build/index.html', { root: __dirname });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //   res.render('error');
    res.json({
        message: err.message,
        error: err
    });
});

module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});

app.listen(port, () => {
  console.log('App is listening on port '+port);
});
