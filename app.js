/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://olgaluk:15041986olga@cluster0-8rvl3.mongodb.net:27017/admin?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

const path = require('path');
const crypto = require('crypto');

const User = require('./db/models/User.js');

const app = express();

function authenticationMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else res.status(401).send('Unauthorized');
  };
}

function hash(text) {
  return crypto.createHash('sha1')
    .update(text).digest('base64');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  ((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
      if (user.password !== hash(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }),
));

passport.authenticationMiddleware = authenticationMiddleware;

app.use(express.static(path.join(__dirname, '/html')));
app.use(session({
  secret: 'some big panda',
  store: new MongoStore({
    url: 'mongodb://localhost:27017/Healthy',
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
  },
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const home = require('./routes/home');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const main = require('./routes/main');

app.use('/home', passport.authenticationMiddleware(), home);

app.use('/signin', passport.authenticate('local'), signin);

app.use('/signup', signup);

app.use('/main', passport.authenticationMiddleware(), main);

app.listen(7777, () => {
  console.log('Started listening on port', 7777);
});
