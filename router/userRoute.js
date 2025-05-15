const express = require("express");
const { register, login, firebaseAuth, getUser, logout, getAllUser, editUser, getOneUser, resetPassword } = require("../controller/userController");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware")
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
router.post("/register", upload.single("avatar"),register);
router.post("/login", login);
router.get("/get-one-user",authMiddleware,getUser)
router.post("/logout",logout)
router.get("/get-all-user",getAllUser)
router.put("/edit-user/:id",upload.single("avatar"),editUser)
router.get("/get-one-user-edit/:id",getOneUser)
router.put("/reset-password", resetPassword);
module.exports = router;
