const express = require("express");
const {
  createCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
  getDeleteCategory,
} = require("../controller/categoryConttroller");

const router = express.Router();

router.post("/create-category", createCategory);

// Route to get all products
router.get("/get-category", getAllCategory);

// Route to get a single product by ID
router.get("/get-one-category/:id", getOneCategory);

// Route to update an existing product by ID

router.put("/get-edit-category/:id", updateCategory);
// Route to delete a product by ID
router.delete("/delete-category/:id", getDeleteCategory);

module.exports = router;
