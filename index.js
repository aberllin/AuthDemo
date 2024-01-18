const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const session = require('express-session');

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/authDemo');

const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: 'mysecret', resave: false, saveUninitialized: true }),
);

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.render('register');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const newUser = new User({ username, password: hash });
  await newUser.save();
  req.session.user_id = newUser._id;
  res.redirect('/home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (isValidPassword) {
    req.session.user_id = user._id;
    res.redirect('/secret');
  } else {
    res.send('TRY AGAIN!');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
  res.render('secret');
});
app.get('/admin', requireLogin, (req, res) => {
  res.render('secret');
});

app.listen(3000, () => {
  console.log('LISTENING ON 3000!');
});
