const express = require("express");
// const errorMiddleware = require("./middleware/error");
const cookie = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
app.use(cors());

// OR to allow only a specific origin:
app.use(cors({ origin: "http://localhost:3000" }));
dotenv.config({ path: ".env" });
app.use(cookie());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(fileUpload());

//Route Imports

const product = require("./router/productRoute");
// const aws = require("./router/s3routes");

app.use("/api/v1", product);
// app.use("/api/v1/s3", aws);

module.exports = app;
