const mongoose = require('mongoose');

const Cart = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
      },
      quantity: Number,
    },
  ],
},
{ collection: "Cart" }
);
 

module.exports = mongoose.model("Cart", Cart);
