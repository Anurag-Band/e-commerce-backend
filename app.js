const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ejs config
app.set("view engine", "ejs");

//morgan middleware
app.use(morgan("tiny"));

// import all routes here
const homeRoute = require("./routes/homeRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const paymentRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");

//  router middleware
app.use("/api/v1", homeRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", orderRoute);

// route for ejs
app.get("/signuptest", (req, res) => {
  res.render("signuptest");
});

// exporting app for index.js
module.exports = app;
