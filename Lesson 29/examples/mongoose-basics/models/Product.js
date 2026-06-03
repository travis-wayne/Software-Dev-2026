import mongoose from 'mongoose';

// 1. Define the Schema
// A schema defines the structure of the document, default values, and validators.
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    default: 'No description provided.'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically sets the date when a new document is created
  }
});

// 2. Create and export the Model
// The model provides an interface to the database for creating, querying, updating, deleting records, etc.
const Product = mongoose.model('Product', productSchema);

export default Product;
