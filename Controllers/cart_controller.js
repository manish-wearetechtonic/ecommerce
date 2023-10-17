const User = require("../Models/users.model");
const Product = require("../Models/product_model");
const Cart = require("../Models/cart_model"); 

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if the user exists
    const user = await User.findOne({ _id: res.locals.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product exists
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has a cart; if not, create one
    let cart = await Cart.findOne({ user: user._id });
    
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }
    console.log(`Product Id: ${productId}\nQuantity: ${quantity}\nCart ${cart}`);
    // Check if the product is already in the cart
    const cartItem = cart.products.find((item) => item.product.equals(product._id));

    if (cartItem) {
      // If the product is already in the cart, update the quantity
      cartItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      cart.products.push({ product: product._id, quantity });
    }

    // Save the cart
    await cart.save();

    return res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error('Error finding cart:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCart = async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ _id: res.locals.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: user._id }).populate("products.product");

    return res.json({ message: "Cart retrieved successfully", data: cart });
  } catch (error) {
    console.error('Error finding cart:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if the user exists
    const user = await User.findOne({ _id: res.locals.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter((item) => !item.product.equals(productId));
    
    // Save the updated cart
    await cart.save();

    return res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error('Error finding cart:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart
};
