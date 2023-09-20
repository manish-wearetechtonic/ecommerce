const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const createError = require("http-errors");


const { adminSignup, login} = require("../Controllers/admin_controller");
const { addProduct, addReview, getProducts} = require("../Controllers/product_controller");


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
  router.post("/addReview", addReview)
  router.get("/getProducts", getProducts)
module.exports = router;