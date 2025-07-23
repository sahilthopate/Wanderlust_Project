const express =require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema}= require("../schema.js");
const Listing =require("../models/listing.js");
const {isLoggedIn ,validateReview ,isOwner ,isReviewAuthor} = require("../middleware.js");
const Review =require("../models/review.js");
const reviewController = require("../controllers/review.js");


//Reviews
//Post Route
router.post("/", 
    isLoggedIn ,
    validateReview, 
    reviewController.createReview
    );


//delete review route
router.delete("/:reviewId",isLoggedIn, 
    isOwner ,
    isReviewAuthor, 
    wrapAsync(reviewController.deleteReview));

module.exports=router; 
