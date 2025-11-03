const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings, selectedCategory: null });
};



module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


// module.exports.showListing = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate({
//     path: "reviews", populate: {
//       path: "author",
//     },
//   }).populate("owner");

//   if (!listing) {
//     req.flash("error", "Listing You Looking for does not exist!");
//     return res.redirect("/listings");
//   }
//   res.render("listings/show.ejs", { listing });
// };



module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you are looking for does not exist!");
    return res.redirect("/listings");
  }

  // 👇 Fetch related listings having same category but exclude current one
  const relatedListings = await Listing.find({
    category: listing.category,
    _id: { $ne: listing._id },
  }).limit(4); // show only 4 related

  res.render("listings/show.ejs", { listing, relatedListings });
};


module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You Looking for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl =  originalImageUrl.replace("/upload", "upload/w_250");
 
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};



module.exports.categoryListings = async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });

  res.render("listings/index.ejs", { 
    allListings: listings,
    selectedCategory: category 
  });
};
