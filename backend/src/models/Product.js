const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Product stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    badge: {
      type: String,
      trim: true,
      default: ''
    },
    colors: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 24
    },
    isBestseller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Add index for search and category filtering
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = { Product };
