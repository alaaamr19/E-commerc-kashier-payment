const mongoose = require("mongoose");
const Product = require("../models/product"); // Replace with your Product model

const seedData = require("../seeders/products.json");

mongoose.connect("mongodb://localhost:27017/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    await Product.deleteMany(); // Clear existing data
    await Product.insertMany(seedData);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
