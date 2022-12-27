const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

const multer = require('multer');//<----------

//DotEnv 
const { PORT } = require('./config');
console.log(PORT,'<< PORT <-> index.js');


const { database } = require('./keys');

// Intializations
const app = express();
require('./lib/passport'); 

// Settings
//app.set('port', process.env.PORT || 5504);<<<<<<<<<
app.set('port', PORT);


app.engine('exphbs', exphbs({extname: 'exphbs', defaultLayout: 'main', layoutsDir: __dirname + 'views/layouts/'}));

//? ////////////////////////////////
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: 'inicio_de_sesion',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
//app.use(multer({}));
//app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/actor_usuario'));
app.use(require('./routes/actor_admin'));
app.use(require('./routes/authentication'));
app.use(require('./routes/retrieve_account'));
app.use('/actor_usuario', require('./routes/actor_usuario'));
app.use('/actor_administrador', require('./routes/actor_admin'));
app.use('/links', require('./routes/links'));


//
app.use('regristro', require('./views/auth/signup.hbs'))
//

// Public
app.use(express.static(path.join(__dirname, 'public')));  


// Starting
app.listen(app.get("port"), () => {
  console.log('Server is in port', app.get('port'));
// app.listen(app.get('port'), () => {
//   console.log('Server is in port', app.get('port'));
});

