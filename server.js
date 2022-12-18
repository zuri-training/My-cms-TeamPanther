const express = require("express"); //import and initialize express
const { json } = require("express"); //To be able read and see data in JSON format...
require("dotenv").config();
const AppError = require("./server/utils/appError"); //Error message creator object.
const globalErrorHandler = require("./server/controller/errorController");
const auth = require("./server/controller/authController");
const morgan = require("morgan");
const path = require("path");
const { engine } = require("express-handlebars");

// IMPORT ROUTES
const userRoutes = require("./server/routes/userRoutes");
const pageRoutes = require("./server/routes/pageRoutes");
const dashboardRoutes = require("./server/routes/dashboardRoutes");

//IMPORT DB CONNECTION
const connect = require("./server/database/connection"); //connecting to the dataBase
connect.connect(); //calling the connect function to enable connection to local or Atlas hosted DB.

const HOST = process.env.HOST || "0.0.0.0" || "localhost";
const API_PORT = process.env.PORT || process.env.API_PORT || 4001; //acquiring port from .env files

const app = express(); //instantiating

// Handlebars init
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// MIDDLE-WARES
app.use(express.urlencoded({ extended: true }));
app.use("/", pageRoutes);
app.use(express.static(path.join(__dirname, "client")));
app.use(json()); // Enable parsing of json objects in body of request
app.use(morgan("dev"));

//ROUTES
app.use("/home", userRoutes); //Defining a middle-ware, a path to display todo items/create/update/delete
app.use("/dashboard", dashboardRoutes); //Defining a middle-ware, a path to display todo items/create/update/delete
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

app.listen(API_PORT, () => console.log(`Serving on port ${HOST}:${API_PORT}.`));
