if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const expressSession = require("express-session");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const MongoStore = require("connect-mongo");

const Listing = require("./models/listing.js");

main().then(() => {
  console.log("connected to db");
}).catch((err) => {
  console.log(err);
})

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: "mysupersecretecode"
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error occur");
});
const sessionOptions = {
  store,
  secret: "mysupersecrete",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};





app.use(session(sessionOptions));
app.use(flash());

// passport (authentication and authorization)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=> {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.get("/", async (req, res) => {
  // Fetch all listings from the database
  const allListings = await Listing.find({});
  
  // Now render "index" and pass the variables it needs
  res.render("listings/index", { 
    allListings: allListings,
    selectedCategory: null // Pass null so the "if" check works
  });
});


// map 
// app.get("/map", (req, res) => {
//   res.render("map");  // renders map.ejs
// });



// middlewares
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let {status= 500, message= "Something went wrong"} = err;
  res.status(status).render("error.ejs", {message});
  // res.status(status).send(message);
});


app.listen(process.env.PORT, () => {
  console.log(`Server is starting to port ${process.env.PORT}`);
});