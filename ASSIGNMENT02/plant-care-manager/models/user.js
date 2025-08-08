// models/User.js
// Minimal user model to support local (username/password) + GitHub auth

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  // password will be empty for GitHub-only accounts
  password: { type: String },
  githubId: { type: String }
}, { timestamps: true });

// Hash password only if it was set/changed
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper to compare plaintext login password with hashed one
UserSchema.methods.matchPassword = function (plain) {
  if (!this.password) return false; // GitHub-only user has no local password
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);
