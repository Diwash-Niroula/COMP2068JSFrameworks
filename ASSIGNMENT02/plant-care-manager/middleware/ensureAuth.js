middleware/ensureauth

module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash('error', 'Please log in to continue.');
  res.redirect('/auth/login');
};
