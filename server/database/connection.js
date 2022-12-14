const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const { MONGO_URL, DATABASE_LOCAL } = process.env;

exports.connect = () => {
  //Connecting to the mongoDB
  mongoose
    .connect(MONGO_URL || DATABASE_LOCAL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Connected to Database Successfully!");
    })
    .catch((err) => {
      console.log("Database connection failed, exiting now...");
      console.error(err);
      process.exit(1);
    });
};
