const Product = require("../Models/product_model");

// Function for adding Product
const addProduct = async (req, res) =>{
    try {
            console.log(req.body);
        let { title,description,price ,category,brand,imageUrls,stockQuantity,seller} = req.body;
        
        if(title.length < 1){
            return res.status(409).json({
                message: "Product title can not be empty"
            });
        }
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}

module.exports = {
    addProduct
}