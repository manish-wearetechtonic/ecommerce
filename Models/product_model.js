const mongoose = require('mongoose');

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
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Home', 'Books', 'Toys', 'Other'],
  },
  brand: {
    type: String,
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
      },
      review: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Add more fields as needed for your specific application
});

module.exports = mongoose.model('Product', productSchema);
