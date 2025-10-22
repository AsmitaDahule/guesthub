const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");

const MONGO_URL = "mongodb://localhost:27017/guestHub"

main().then(() =>{
  console.log("connected to db");
}).catch((err) => {
  console.log(err);
})

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

let PORT = 8080;


app.get("/", (req,res) => {
  res.send("hi, i am from root")
});



// new route
app.get("/listings/new", (req,res) => {
  res.render("listings/new.ejs");
});

// index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
});


// show route
app.get("/listings/:id", async (req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
});

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings")
})



// app.get("/testListing", async (req, res) =>{
//   let sampleListing = new Listing({
//     title: "My New Home",
//     description: "by the beach",
//     image: "",
//     price: 1200,
//     location: "wani, yt",
//     country: "india",
//   });

//   await sampleListing.save();
//   console.log("sample save");
//   res.send("success");
// });





app.listen(PORT, () =>{
  console.log(`Server is starting to port ${PORT}`);
});