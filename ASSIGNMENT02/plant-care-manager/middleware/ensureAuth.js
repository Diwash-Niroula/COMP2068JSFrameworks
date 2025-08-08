// middleware/ensureAuth.js
module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login'); // or wherever your login route is
};
