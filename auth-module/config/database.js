// WAY 1
// const mongoose = require("mongoose");

// const { config } = require("dotenv");

// config();

// //Connecting to the dataBase...

// async function connect(uri) {
//   try {
//     mongoose.connect(uri || process.env.MONGO_DB_LOCAL);
//     console.log("Connected to MongoDB ");
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// module.exports = connect;

// WAY 2

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const { MONGO_URL } = process.env;

exports.connect = () => {
  //Connecting to the mongoDB
  mongoose
    .connect(MONGO_URL || "mongodb://127.0.0.1:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
