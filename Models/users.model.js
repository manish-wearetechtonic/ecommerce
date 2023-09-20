const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    
    name: {
      type: String,
      required: true,
    },
    
    phone: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,

    },
    password: {
      type: String,
      required: true,
      minlength: 6

    },
    tokens: {
      type: [{
        refreshToken: String,
      }],
      _id: false,
      default: null
    }
  },
  { collection: "User" }
);

module.exports = mongoose.model("User", User);
