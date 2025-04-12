const express = require("express");
const {
  createCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
  getDeleteCategory,
  createCategoryBanner,
  getAllCategoryBanner,
  getOneCategoryBanner,
  updateCategoryBanner,
  getDeleteCategoryBanner,
} = require("../controller/categoryConttroller");
const multer = require("multer");
var multerS3 = require("multer-s3-v2");
const s3 = require("../confiq/awsConfiq");
const uniqid = require("uniqid");
const router = express.Router();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Generate a unique ID for each file and use the original file name
      const uniqueId = uniqid(); // Generate unique ID
      const fileExtension = file.originalname.split(".").pop(); // Get file extension
      const uniqueFileName = `${uniqueId}.${fileExtension}`; // Combine unique ID with the file extension
      cb(null, uniqueFileName); // Set the file key
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});
router.post("/create-category", createCategory);

// Route to get all products
router.get("/get-category", getAllCategory);

// Route to get a single product by ID
router.get("/get-one-category/:id", getOneCategory);

// Route to update an existing product by ID

router.put("/get-edit-category/:id", updateCategory);
// Route to delete a product by ID
router.delete("/delete-category/:id", getDeleteCategory);
//catgeory Bannaer

router.post("/create-category-banner",upload.single("avatar"), createCategoryBanner);

// Route to get all products
router.get("/get-category-banner", getAllCategoryBanner);

// Route to get a single product by ID
router.get("/get-one-category-banner/:id", getOneCategoryBanner);

// Route to update an existing product by ID

router.put("/get-edit-category-banner/:id", upload.single("avatar"),updateCategoryBanner);
// Route to delete a product by ID
router.delete("/delete-category-banner/:id", getDeleteCategoryBanner);
module.exports = router;
