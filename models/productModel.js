const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productId: {
    type: String,
  },
  title: {
    type: String,
    trim: true,
  },
  materialType:{
    type:String,
  },
  badge: {
    type: String,
  },
 
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  discountPercentage: {
    type: Number,
  },
  images: [
    {
      imageId: { type: String },
      url: { type: String }, // Added this field for storing the image URL
      color: { type: String },
    }
  ],
  
  category: {
    type: String,
  },
  stock: {
    type: Number,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  sizes:[
   {
    sizevalue:{
      type:String,
    },
    price:{
      type:Number,
    },
    notAvailable:{
      type:Boolean,
    },
   },
  ],
  reviews: [
    {
      name: {
        type: String,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],

  user: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
