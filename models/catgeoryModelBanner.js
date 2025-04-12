const mongoose = require("mongoose");

const categorySchemas = mongoose.Schema({
    avatar:{
        type:String,
    },
  name: {
    type: String,
  },
  link:{
    type:String,
  }
  
});

module.exports = mongoose.model("CategoryBanner", categorySchemas);
