const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(() => {
    console.log("Connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
  try {
    // Clear old data
    await Listing.deleteMany({});
    
    // Add owner field
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "68c6320f793c9de6e135eae8"
    }));

    // Insert new data
    await Listing.insertMany(initData.data);
    console.log("Data seeded successfully!");

  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    // Close only after everything finishes
    await mongoose.connection.close();
  }
};

initDB();