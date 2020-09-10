var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var logisticsRouter = require('./routes/logistics');
var userRouter = require('./routes/users');

var multer = require('multer');
const cors = require('cors');

var app = express();
app.use(cors());


var upload = multer();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// for parsing utils/json
app.use(bodyParser.json());

// for parsing utils/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());


app.use('/', indexRouter);
//Log Manager
app.use('/logistics', logisticsRouter);
app.use('/users', userRouter);

//Audit Maanger

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const hostname = '127.0.0.1';
const port = 3001;


app.listen(port, hostname, () => {
  console.log(`University Webapp`);
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
