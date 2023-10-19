const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const createError = require("http-errors");


const { adminSignup, login} = require("../Controllers/admin_controller");
const { addProduct, addReview, getProducts, editProduct,deleteProduct} = require("../Controllers/product_controller");
const { addBrand, addCategory, getBrand, getCategory} = require("../Controllers/common_controller");


router.post("/signup", adminSignup)
router.post("/login", login)
 

// router.post("/login",login)

router.use(function (req, res, next) {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      res.locals.id = payload.id;
      next();
    });
  }); 
  

  router.post("/addProduct", addProduct)
  router.delete("/deleteProduct/:productId",deleteProduct)
  router.put("/editProduct", editProduct)
  router.post("/addReview", addReview)
  router.post("/addBrand", addBrand)
  router.post("/addCategory", addCategory)
  router.get("/getProducts", getProducts)
  router.get("/getBrand", getBrand)
  router.get("/getCategory", getCategory)
module.exports = router;