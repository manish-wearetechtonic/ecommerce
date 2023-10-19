const { model } = require("mongoose");
const Brand = require("../Models/brand_model")
const Category = require("../Models/category_model")
const User = require("../Models/users.model");

const addBrand = async(req, res) =>{
    try {
      let {name} = req.body
    const user = await User.findOne({ _id: res.locals.id });

    if (user.isAdmin === false) {
      return res.status(404).json({
        message: "You don't have right to add Brand"
      });
    }
    
    if (req.body.length < 1) {
      return res.status(409).json({
        message: "Barnd name can not be empty"
      });
    }
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
        return res.status(409).json({ message: "Brand already exists" });
    }

    const addedBrand = await Brand.create({ name})
    return res.json({
        message: "Barnd created successfully!",
        _id: addedBrand._id
      })
    } catch (error) {
        return res.status(500).json({
            status:false,
            message: "Internal Server Error"
        })
    }
} 

const addCategory = async(req, res) =>{
    try {
      let { name } = req.body
    const user = await User.findOne({ _id: res.locals.id });

    if (user.isAdmin === false) {
      return res.status(404).json({
        message: "You don't have right to add Category"
      });
    }
    if (req.body.length < 1) {
      return res.status(409).json({
        message: "Category name can not be empty"
      });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(409).json({ message: "Category already exists" });
    }
    const addedCategory = await Category.create({name})
    return res.json({
        message: "Category created successfully!",
        _id: addedCategory._id
      })
    } catch (error) {
        return res.status(500).json({
            status:false,
            message: "Internal Server Error"
        })
    }
} 

const getBrand = async (req, res) => {
    try {
      const products = await Brand.find();
  
      return res.json({
        message: "Given all Brand successfully",
        data: products
      })
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
}

const getCategory = async (req, res) => {
    try {
      const category = await Category.find();
  
      return res.json({
        message: "Given all Category successfully",
        data: category
      })
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
}

module.exports = {
    addBrand,
    addCategory,
    getBrand,
    getCategory
}