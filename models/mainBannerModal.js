const mongoose = require("mongoose");

const bannerSchemas = mongoose.Schema({
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

module.exports = mongoose.model("Banner", bannerSchemas);
