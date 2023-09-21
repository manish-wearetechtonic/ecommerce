const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const createError = require("http-errors");


const { addUser, login, resetPassword} = require("../Controllers/user_controller");
const {  addReview, getProducts, editReview} = require("../Controllers/product_controller");


router.post("/addUser", addUser)
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
  
  router.post("/addReview", addReview)
  router.get("/getProducts", getProducts)
  router.post("/editReview", editReview)
  router.post("/resetPassowrd", resetPassword)
module.exports = router;