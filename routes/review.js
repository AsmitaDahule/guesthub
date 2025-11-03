const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // Required for nested route
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Create Review
router.route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review
router.route("/:reviewId")
  .delete(isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
