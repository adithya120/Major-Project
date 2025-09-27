const express= require("express");
const router =  express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const {isLoggedIn, isOwner,validatelisting}=require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage})

// Parse any image value into a string
// const parseListingImage = (req, res, next) => {
//   if (req.body.listing && req.body.listing.image) {
//     let img = req.body.listing.image;

//     if (typeof img === "object" && img.url) {
//       req.body.listing.image = img.url; // object → string
//     } else if (!img) {
//       req.body.listing.image = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?..."; // default
//     } else {
//       req.body.listing.image = img.toString(); // anything else → string
//     }
//   }
//   next();
// };

router.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    // parseListingImage,
    
    upload.single('listing[image]'),
    validatelisting,
     wrapAsync(listingController.createListing))


//New Route
router.get('/new',isLoggedIn ,listingController.newListing)

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,
     isOwner,
     upload.single("listing[image]"),
    //  parseListingImage,
     validatelisting,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,
    isOwner
    ,wrapAsync(listingController.deleteListing))



// Edit Route
router.get('/:id/edit',
    isLoggedIn
    , wrapAsync(listingController.editListing));


module.exports=router;
