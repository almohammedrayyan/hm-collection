const express = require("express");
const multer = require("multer");
var multerS3 = require("multer-s3-v2");
const s3 = require("../confiq/awsConfiq");
const uniqid = require("uniqid");
const {
  createProduct,
  getAllProduct,
  getEditProduct,
  getOneProduct,
  deleteProduct,
  getOneProductId,
  getAllProductFilter,
  getAllProductSizeFilter,
  getAllProductPriceFilter,
} = require("../controller/productController");
const path = uniqid()
const router = express.Router();
// Multer storage configuration for handling image uploads
// Multer storage configuration for handling image uploads
// const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: process.env.S3_BUCKET_NAME,
//       acl: "public-read",
//       metadata: (req, file, cb) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: function (req, file, cb) {
//         // Generate a unique ID for each file and use the original file name
//         const uniqueId = uniqid(); // Generate unique ID
//         const fileExtension = file.originalname.split(".").pop(); // Get file extension
//         const uniqueFileName = `${uniqueId}.${fileExtension}`; // Combine unique ID with the file extension
//         cb(null, uniqueFileName); // Set the file key
//       },
//     }),
//     limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
//   });
  

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueId = uniqid();
      const fileExtension = file.originalname.split(".").pop();
      const uniqueFileName = `${uniqueId}.${fileExtension}`;
      cb(null, uniqueFileName);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // Increase for video (e.g., 50MB)
});

  // Allow up to 5 images per request

// Route to create a new product
router.post(
  "/create-product",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 }, // for video thumbnail
  ]),
  createProduct
);

  

// Route to get all products
router.get("/get-products", getAllProduct);

// Route to get a single product by ID
router.get("/get-one-product/:id", getOneProduct);
router.get("/get-one-product-id/:productId", getOneProductId);

router.get("/get-products-filter",getAllProductFilter)
// Route to update an existing product by ID

router.put("/get-edit-product/:id", upload.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 }, // for video thumbnail
  ]), getEditProduct);
// Route to delete a product by ID
router.delete("/delete-product/:id", deleteProduct);
router.get("/get-products-filter-size",getAllProductSizeFilter)
router.get("/get-products-filter-price",getAllProductPriceFilter)
module.exports = router;
