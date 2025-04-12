const dotenv = require("dotenv");
dotenv.config(); // Load variables from .env BEFORE accessing them

const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = () => {
  mongoose
    .connect(dbUrl, connectionParams)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      console.error("Database connection error:", error);
      process.exit(1);
    });
};

module.exports = connectDB;
