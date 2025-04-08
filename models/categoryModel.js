const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subCategories: [
    {
      type: String, // You can store subcategories as an array of strings
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
