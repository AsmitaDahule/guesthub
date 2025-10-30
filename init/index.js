const mongoose = require("mongoose");
const initData = require("./data..js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/guestHub"

main().then(() =>{
  console.log("connected to db");
}).catch((err) => {
  console.log(err);
})

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "6901e5ede6fd0a1a028cb984"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialize");
};

initDB();