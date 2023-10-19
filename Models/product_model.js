const mongoose = require('mongoose');
const { categoryList, brandList } = require('../Common/utilis');
// const { categoryList } = require('../Common/utilis');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  productCategory: {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category', // Reference to the Category model
    },
    name: String
  },
  productBrand: {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Brand', // Reference to the Brand model
    },
    name: String
  },

  imageUrls: {
    type: [String],
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 0
      },
      review: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ]
  // Add more fields as needed for your specific application
});

module.exports = mongoose.model('Product', productSchema);
