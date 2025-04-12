const Category = require("../models/categoryModel");
const catgeoryModelBanner = require("../models/catgeoryModelBanner");
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(201).json({ message: "Get All Categories", categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(201).json({ message: "Get One Product", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeleteCategory = async (req, res) => {
  try {
    const categoryOne = await Category.findByIdAndDelete(req.params.id);
    if (!categoryOne) {
      return res.status(404).json({ message: "Category not found" });
    }
    res
      .status(200)
      .json({ message: "Category deleted successfully", categoryOne });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    // Expecting updated values
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
///catgeory banner
exports.createCategoryBanner = async (req, res) => {
  try {
    const { name } = req.body;
    const avatar = req.file ? req.file.location : null; // AWS S3 URL
    let category = new catgeoryModelBanner({
      name,
      avatar,
    });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllCategoryBanner = async (req, res) => {
  try {
    const categories = await catgeoryModelBanner.find({});
    res.status(201).json({ message: "Get All Categories", categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneCategoryBanner = async (req, res) => {
  try {
    const category = await catgeoryModelBanner.findById(req.params.id);
    res.status(201).json({ message: "Get One Product", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeleteCategoryBanner = async (req, res) => {
  try {
    const categoryOne = await catgeoryModelBanner.findByIdAndDelete(req.params.id);
    if (!categoryOne) {
      return res.status(404).json({ message: "Category not found" });
    }
    res
      .status(200)
      .json({ message: "Category deleted successfully", categoryOne });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategoryBanner = async (req, res) => {
  try {
    // Expecting updated values
    const avatar = req.file ? req.file.location : null;
    const updatedCategory = await catgeoryModelBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      avatar,
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};