const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI) // No need for options
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDB Connection Error:", err);
      process.exit(1); // Exit process with failure
    });
};

module.exports = connectDatabase;
