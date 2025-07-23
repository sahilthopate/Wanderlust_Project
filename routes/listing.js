const express =require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware");
const Review = require("../models/review.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//listings/:id/new

//Index and Create Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn, 
    validateListing, 
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
);

//New Route
router.get("/new",isLoggedIn , listingController.renderNewForm);

//Show , Update , delete Route
router
    .route("/:id")
    .get(listingController.showListing)
    .put( 
    isLoggedIn,
    isOwner, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
    )
    .delete( 
    isLoggedIn,
    isOwner,
    listingController.deleteListing 
    );

//Edit Route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    listingController.editlisting
    );






module.exports = router;
