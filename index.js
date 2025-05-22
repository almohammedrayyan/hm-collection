// const cloudinary = require("cloudinary");
const express = require("express");
// const errorMiddleware = require("./middleware/error");
const cookie = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const productRoutes = require("./router/productRoute");
const categoryRoutes = require("./router/categoryRoute");
const userRoutes = require("./router/userRoute");
const orderRoutes =require("./router/orderRoute")

const connectDataBase = require("./confiq/database");
//handling uncaught exception

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://bycart-admin.netlify.app",
      "https://bycart.netlify.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
};
app.use(cors(corsOptions));
dotenv.config({ path: ".env" });
app.use(cookie());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
// app.use(bodyParser.json({ limit: "500mb" }));
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  process.exit(1);
});
const PORT = process.env.PORT || 4000;
//confiq
dotenv.config({ path: ".env" });
connectDataBase();

//add route
app.use("/api/v1", productRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

server.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
