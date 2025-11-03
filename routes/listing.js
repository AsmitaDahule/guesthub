const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// New route (must come before :id route)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Index + Create routes
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


// Show + Update + Delete routes
router.route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) // Update
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


router.get("/category/:category", listingController.categoryListings);

module.exports = router;
