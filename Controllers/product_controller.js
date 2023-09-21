const { categoryList } = require("../Common/utilis");
const Product = require("../Models/product_model");
const User = require("../Models/users.model");

// Function for adding Product
const addProduct = async (req, res) =>{
    try {
             
        let { title,description,price ,category,brand,imageUrls,stockQuantity} = req.body;
         // Check if the user exists
      const user = await User.findOne({ _id: res.locals.id });

      if (user.isAdmin === false) {
        return res.status(404).json({
          message: "You don't have right to add Product"
        });
      }
        if(title.length < 1){
            return res.status(409).json({
                message: "Product title can not be empty"
            });
        }
        if(!categoryList.includes(category)){
            return res.status(409).json({
                message: `Invalid category!, Use from this ${categoryList}`
            });
        }
        const addedProduct = await Product.create({
            title,
            description,
            price,
            category,
            brand,
            imageUrls,
            stockQuantity,
        })

        return res.json({
            message: "Product created successfully!",
            _id:addedProduct._id
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}


// Write Review
const addReview = async (req, res) => {
    try {
      let { productId, rating, review } = req.body;
  
      if (!productId) {
        return res.status(400).json({
          message: "productId is required"
        });
      }
  
      // Check if the user exists
      const user = await User.findOne({ _id: res.locals.id  });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if(rating > 5){
        return res.status(404).json({
            message: "Can not rate more than 5 starts"
          });
      }
  
      // Update the product with the new rating and review
      const updateResult = await Product.updateOne(
        { _id: productId },
        {
          $addToSet: {
            ratings: {
              user: user.id,
              rating: rating,
              review: review,
            },
          },
        }
      );
  
      if (updateResult.nModified === 0) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
  
      return res.status(201).json({
        message: "Review added successfully",
      });
    } catch (error) {
      console.error("Error adding review:", error);
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
  }

// Get All Product
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.json({
            message: "Given all products successfully",
            data: products
        })
    } catch (error) {
       return res.status(500).json({
          message: "Internal Server Error"
        });
    }
}

// Edit Review
const editReview = async (req, res) => {
  try {
    let { productId, reviewId, review } = req.body;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        message: "The requested product does not exist in the system."
      });
    }

 
    const foundReview = product.ratings.find((rating) => rating._id.toString() === reviewId);

    if (!foundReview) {
      return res.status(404).json({
        error: "Review not found",
        message: "The requested review does not exist for this product."
      });
    }

    foundReview.review = review;
    await product.save();

    return res.status(200).json({
      message: "Review updated successfully"
    });
  } catch (error) {
    console.error("Error editing review:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = {
    addProduct,
    addReview,
    getProducts,
    editReview

}