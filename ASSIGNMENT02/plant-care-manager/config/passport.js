// config/passport.js
// Sets up Local (username/password) and GitHub OAuth strategies

const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

module.exports = function (passport) {
  // ---------- Local Strategy (username + password) ----------
  passport.use(new LocalStrategy(
    // by default LocalStrategy expects fields: username, password
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: 'User not found' });

        const ok = await user.matchPassword(password);
        if (!ok) return done(null, false, { message: 'Invalid credentials' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // ---------- GitHub Strategy ----------
  passport.use(new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find by GitHub ID; create a minimal account if first-time
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username || profile.displayName || `gh_${profile.id}`
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // ---------- Sessions ----------
  passport.serializeUser((user, done) => {
    done(null, user.id); // store user id in session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
