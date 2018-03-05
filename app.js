const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const consolidate = require('consolidate');

// Route Files
let articles = require('./routes/articles');
let Article = require('./models/article');
let users = require('./routes/users');


// configure database connection
mongoose.connect(config.database);
let db = mongoose.connection;
// Check connection
db.once('open', function(){
  console.log('Successully connected to MongoDB');
});
// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();
// Define the port to run on
app.set('port', 3000);
// Bring in Models

app.use('/articles', articles);
app.use('/users', users);

// Load View Engine with pug
// app.set('views', path.join(__dirname, 'src/main/dev/views'));
// app.set('view engine', 'pug');

// Load View Engine with html
app.engine('html', consolidate.swig);
app.set('views', path.join(__dirname, './src/main/dist/views/'));
app.set('view engine', 'html');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, './src/')));
// app.use('/src', express.static(path.join(__dirname, '/public')));
//Serve static content for the app from the "public" directory in the application directory.

/**
 * This will map our customized location for .css and .js file to the static location of /public/
 */
// GET /style.css etc
app.use(express.static(__dirname + '/public'));
// Mount the middleware at "./src/main/dist/" to serve static content only when their request path is prefixed with "./src/main/dist/".
app.use('./src/main/dist/', express.static(__dirname + '/public'));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

/**
 * Home Route
 * This makes get request to render the home page
 */
app.get('/', function(req, res){   
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', { // access to the index.html page
        title:'Articles',
        articles: articles
      });
    }
  });
});
// app.all('*', function (req, res) {
//   res.status(404);
//   res.render('errors/404'); 
// });

// In Express a 404 is not the result of an error but rather the app running out of options.
// app.use(function(req, res, next) {  
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// Error handlers
// if (app.get('env') === 'development') {  
//   app.use(function(err, req, res, next) {
//       res.status(err.status || 500);
//       res.render('error', {
//           message: err.message,
//           error: err
//       });
//   });
// }

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server started on port...' + port);
});
