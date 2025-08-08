const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const hbs = require('hbs');

require('dotenv').config();

// DB connect
const connectDB = require('./config/db');
connectDB();

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const plantsRouter = require('./routes/plants');
const authRouter = require('./routes/auth');

const app = express();

// Views / HBS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// register partials (so you can use {{> partialName}} if needed)
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions & Auth
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Expose flash + user + year to all views (⬅️ this is what you asked for)
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // <-- key: controls Login/Register vs Logout
  res.locals.year = new Date().getFullYear();
  next();
});

// Passport strategies
require('./config/passport')(passport);

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/plants', plantsRouter);
app.use('/auth', authRouter);

// 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; // keep this for bin/www
