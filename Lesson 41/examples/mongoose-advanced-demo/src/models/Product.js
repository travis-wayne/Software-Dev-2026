// Lesson 41 — Advanced Mongoose Product Model
// Demonstrates Nested Sub-Document Schemas and Array Aggregation Virtuals!

import mongoose from 'mongoose';

// Sub-document schema for product reviews (embedded inside Product document)
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  // Array of embedded review sub-documents!
  reviews: [reviewSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ─────────────────────────────────────────────────────────────
// VIRTUAL PROPERTY: averageRating
// Dynamically calculates the average review score without storing redundant data in MongoDB!
// ─────────────────────────────────────────────────────────────
productSchema.virtual('averageRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  
  const total = this.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  return Number((total / this.reviews.length).toFixed(1));
});

// Virtual property: reviewCount
productSchema.virtual('reviewCount').get(function() {
  return this.reviews ? this.reviews.length : 0;
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
