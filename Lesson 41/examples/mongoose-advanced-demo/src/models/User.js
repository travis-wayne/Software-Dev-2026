// Lesson 41 — Advanced Mongoose User Model
// Demonstrates Virtual Properties, pre('save') Lifecycle Middleware, and Instance Methods!

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // By default, exclude password hash from standard find() queries!
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
  // Ensure virtual properties are included when document is serialized to JSON/Object
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ─────────────────────────────────────────────────────────────
// VIRTUAL PROPERTY: fullName
// Exists in runtime memory only; never stored on MongoDB disk!
// ─────────────────────────────────────────────────────────────
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// ─────────────────────────────────────────────────────────────
// PRE-SAVE MIDDLEWARE: Automated Bcrypt Password Hashing
// ─────────────────────────────────────────────────────────────
userSchema.pre('save', async function() {
  // CRITICAL GUARD CLAUSE: Only hash if password field is new or modified!
  // If we omitted this check, updating a user's name would re-hash their password hash into garbage!
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────────────────────
// INSTANCE METHOD: Secure Password Comparison
// ─────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
