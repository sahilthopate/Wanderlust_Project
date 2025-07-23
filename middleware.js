const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");
const Review =require("./models/review.js");
const {reviewSchema}= require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permision");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id ,reviewId} = req.params;
    let listing = await Review.findById(reviewId);
    if(!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permision");
        return res.redirect(`/listings/${id}`);
    }
    next();
};