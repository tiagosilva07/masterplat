var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose =require('mongoose'),
dataProviders = require('./models/DataProvidersModel');
thesis = require('./models/ThesisModel')
var bodyParser = require('body-parser');
var app = express();
//Swagger

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//API
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var routes = require('./routes/dataProvidersApi'); //importing route
var thesisRoutes = require('./routes/thesisApi');
var logsRoutes = require('./routes/logApi');
routes(app); //register the route
thesisRoutes(app);//register the thesis routes
logsRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Database 
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/trabalhoPratico')

mongoose.connect('mongodb://masterplat:qwerty1234@cluster0-shard-00-00-vpl62.mongodb.net:27017,cluster0-shard-00-01-vpl62.mongodb.net:27017,cluster0-shard-00-02-vpl62.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true/');
 
var db = mongoose.connection;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
console.log('restful API server started on :');
db.on('Error',console.error.bind(console,'MongoDB connection error:'));
module.exports = app;
