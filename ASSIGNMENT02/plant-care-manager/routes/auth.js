const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// ---------------- LOGIN ----------------
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);

// ---------------- REGISTER ----------------
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.create({ username, password });
    req.flash('success', 'Account created. Please log in.');
    res.redirect('/auth/login');
  } catch (e) {
    req.flash('error', 'Registration failed. Try a different username.');
    res.redirect('/auth/register');
  }
});

// ---------------- GITHUB AUTH ----------------
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// ---------------- LOGOUT ----------------
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash('success', 'You have logged out successfully.');
    res.redirect('/');
  });
});

module.exports = router;
