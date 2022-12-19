const express = require("express"); //import and initialize express
const { json } = require("express"); //To be able read and see data in JSON format...
require("dotenv").config();
const AppError = require("./server/utils/appError"); //Error message creator object.
const globalErrorHandler = require("./server/controller/errorController");
const auth = require("./server/controller/authController");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// IMPORT ROUTES
const userRoutes = require("./server/routes/userRoutes");

//IMPORT DB CONNECTION
const connect = require("./server/database/connection"); //connecting to the dataBase
connect.connect(); //calling the connect function to enable connection to local or Atlas hosted DB.

const API_PORT = `${process.env.API_PORT}` || 4001; //acquiring port from .env files

const app = express(); //instantiating

// GLOBAL MIDDLE-WARES
app.use(helmet()); //-->Set Security HTTP headers

//Limit request from the same API
const limit = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in one hour!",
});

//Body-parser, reading data from the body into req.body
app.use("*", limit); //to restrict the number of requests from a particular IP per hour

//Enable development logging
if (`${process.env.NODE_ENV}` === "development") {
  app.use(morgan("dev"));
}

//Log requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(json()); // Enable parsing of json objects in body of request

//Implement Data Sanitization against NoSQL query injection
app.use(mongoSanitize()); //--> //filter out all dollar signs and dots...

//Implement Data Sanitization against Cross Site Sharing
app.use(xss()); //will clean user input from malicious html code basically

//ROUTES
app.use("/home", userRoutes); //Defining a middle-ware, a path to display todo items/create/update/delete
app.use("/admin-dashboard/users", userRoutes); //Defining a middleware for admin to manipulate users...
app.get("/home", auth.protect, (req, res) => {
  res.status(200).send("Welcome to Our CMS Platform");
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
//GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

app.listen(API_PORT, () => console.log(`Serving on port ${API_PORT}.`));
