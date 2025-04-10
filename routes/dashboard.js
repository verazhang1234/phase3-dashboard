// routes/dashboard.js
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const user = req.session.user;
  res.render('dashboard', { user });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
