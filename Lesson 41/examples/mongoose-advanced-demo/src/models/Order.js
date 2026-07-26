// Lesson 41 — Advanced Mongoose Order Model
// Demonstrates Cross-Collection References (ObjectId) and NoSQL Relational Linkages!

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // References the Product collection!
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false }); // Disable automatic _id generation for simple line items

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User collection for cross-collection .populate() queries!
    required: true,
    index: true // Index for fast user order history lookups!
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
    default: 'COMPLETED'
  },
  items: [orderItemSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property: itemCount
orderSchema.virtual('itemCount').get(function() {
  if (!this.items) return 0;
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
