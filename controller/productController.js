const Product = require("../models/productModel"); // Capitalize model name for clarity
// exports.createProduct = async (req, res) => {
//   try {
//     const {
//       title,
//       discountPercentage,
//       price,
//       category,
//       stock,
//       description,
//       materialType,
//       sizes,
//     } = req.body;

//     // Extract images from req.files (uploaded via S3)
//     const images = req.files.map((file, index) => {
//       const color = req.body.colors ? req.body.colors[index] : null;
//       return {
//         imageId: file.key,
//         url: file.location,
//         color: color || null,
//       };
//     });

//     // Generate prefix using first two letters of category and material
//     const categoryPrefix = category.substring(0, 2).toLowerCase();
//     const materialPrefix = materialType.substring(0, 2).toLowerCase();
//     const prefix = `Pro${categoryPrefix}${materialPrefix}`;

//     // Fetch latest product with same prefix and increment
//     const latestProduct = await Product.findOne({
//       productId: { $regex: `^${prefix}\\d{3}$` }
//     }).sort({ productId: -1 });

//     let sequence = 1;
//     if (latestProduct) {
//       const match = latestProduct.productId.match(/\d{3}$/);
//       if (match) {
//         sequence = parseInt(match[0]) + 1;
//       }
//     }

//     const productId = `${prefix}${String(sequence).padStart(3, '0')}`;

//     const product = new Product({
//       title,
//       images,
//       discountPercentage,
//       price,
//       category,
//       stock,
//       description,
//       sizes,
//       productId,
//       materialType,
//     });

//     await product.save();

//     res.status(201).json({ message: "Product created successfully", product });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      discountPercentage,
      price,
      category,
      stock,
      description,
      materialType,
      sizes,
    } = req.body;

    const images = (req.files.images || []).map((file, index) => {
      const color = req.body.colors ? req.body.colors[index] : null;
      return {
        imageId: file.key,
        url: file.location,
        color: color || null,
      };
    });

    // ✅ Get thumbnail video URL (if uploaded)
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
    const thumbnail = thumbnailFile ? thumbnailFile.location : null;

    const categoryPrefix = category.substring(0, 2).toLowerCase();
    const materialPrefix = materialType.substring(0, 2).toLowerCase();
    const prefix = `Pro${categoryPrefix}${materialPrefix}`;

    const latestProduct = await Product.findOne({
      productId: { $regex: `^${prefix}\\d{3}$` },
    }).sort({ productId: -1 });

    let sequence = 1;
    if (latestProduct) {
      const match = latestProduct.productId.match(/\d{3}$/);
      if (match) {
        sequence = parseInt(match[0]) + 1;
      }
    }

    const productId = `${prefix}${String(sequence).padStart(3, "0")}`;

    const product = new Product({
      title,
      images,
      discountPercentage,
      price,
      category,
      stock,
      description,
      sizes,
      productId,
      materialType,
      thumbnail, // ✅ store thumbnail (video) URL
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// exports.getEditProduct = async (req, res) => {
//   try {
//     const { title, discountPercentage, price, category, stock, description, materialType,sizes } = req.body;

//     console.log("Received files:", req.files);
//     console.log("Received existingImages (raw):", req.body.existingImages);

//     // Parse existing images from JSON
//     let existingImages = [];
//     if (req.body.existingImages) {
//       try {
//         existingImages = JSON.parse(req.body.existingImages);
//       } catch (err) {
//         console.error("Error parsing existingImages:", err);
//         existingImages = [];
//       }
//     }
   
//     // Ensure new images array
//     const newImages = req.files?.map((file, index) => {
//       const color = req.body.colors ? req.body.colors[index] : null;
//       return {
//         imageId: file.key, // AWS S3 Key
//         url: file.location, // AWS S3 URL
//         color: color || null,
//       };
//     }) || [];

//     console.log("Parsed existing images:", existingImages);
//     console.log("New uploaded images:", newImages);

//     // Merge images
//     // Update existing images with new uploads if the imageId matches
// const updatedImages = existingImages.map((existingImage) => {
//   const newImage = newImages.find((img) => img.imageId === existingImage.imageId);
//   return newImage ? newImage : existingImage;
// });

// // Add any completely new images that don't match existing ones
// const finalImages = [...updatedImages, ...newImages.filter(img => !existingImages.some(eImg => eImg.imageId === img.imageId))];


//     console.log("Final merged images array:", updatedImages);

//     // Update product data
//     const updateData = {
//       title,
//       images: finalImages,
//       discountPercentage,
//       price,
//       category,
//       stock,
//       description,
//       sizes,
//       materialType,
//     };

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     res.json({ message: "Product updated successfully", updatedProduct });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getEditProduct = async (req, res) => {
  try {
    const { 
      title,
      discountPercentage,
      price,
      category,
      stock,
      description,
      materialType,
      sizes,
      existingThumbnail // passed as a string from frontend (existing thumbnail URL)
    } = req.body;

    console.log("Received files:", req.files);
    console.log("Received existingImages (raw):", req.body.existingImages);

    // Parse existing images from JSON
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (err) {
        console.error("Error parsing existingImages:", err);
        existingImages = [];
      }
    }

    // Parse colors (if sent as JSON string)
    let colors = req.body.colors;
    if (typeof colors === "string") {
      try {
        colors = JSON.parse(colors);
      } catch (err) {
        colors = [];
      }
    }

    // Handle new images
    const newImages = (req.files.images || []).map((file, index) => {
      const color = colors ? colors[index] : null;
      return {
        imageId: file.key,
        url: file.location,
        color: color || null,
      };
    });

    // Merge new + existing images
    const updatedImages = existingImages.map((existingImage) => {
      const newImage = newImages.find((img) => img.imageId === existingImage.imageId);
      return newImage ? newImage : existingImage;
    });

    const finalImages = [
      ...updatedImages,
      ...newImages.filter(img => !existingImages.some(eImg => eImg.imageId === img.imageId))
    ];

    // Handle thumbnail (new or keep existing)
    const newThumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
    const thumbnail = newThumbnailFile ? newThumbnailFile.location : existingThumbnail;

    // Prepare update data
    const updateData = {
      title,
      images: finalImages,
      thumbnail, // ✅ Single string URL (either new or existing)
      discountPercentage,
      price,
      category,
      stock,
      description,
      sizes,
      materialType,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({}); // Avoid naming conflict

    res.status(201).json({
      success: true,
      products, // Return the created product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message, // Send error message in responsep
    });
  }
};
// controller.js

// exports.getAllProductSizeFilter = async (req, res) => {
//   try {
//     const { size,limit } = req.query; // Get size from query params (e.g., ?size=m)

//     let filter = {};

//     // If a size is provided, filter products with at least one matching sizevalue
//     if (size) {
//       filter.sizes = {
//         $elemMatch: { sizevalue: size.toLowerCase() },
//       };
//     }

//     const products = await Product.find(filter).limit(Number(limit) || 0);

//     res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//       error: error.message,
//     });
//   }
// };
exports.getAllProductSizeFilter = async (req, res) => {
  try {
    const { size, limit } = req.query;

    let filter = {};

    // Size mapping: 'm' includes these numeric values
    const sizeMapping = {
      s: [50],
      m: [52],
      l: [54],
      xl: [56],
      xxl: [58],
      '3xxl': [60],
      '4xxl': [62],
    };

    if (size) {
      const lowerSize = size.toLowerCase();
      const numericSizes = sizeMapping[lowerSize] || [];

      filter.sizes = {
        $elemMatch: {
          $or: [
            { sizevalue: lowerSize }, // Match string value like 'm'
            { sizevalue: { $in: numericSizes.map(String) } }, // Match mapped numbers as strings
          ],
        },
      };
    }

    const products = await Product.find(filter).limit(Number(limit) || 0);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.getAllProductPriceFilter = async (req, res) => {
  try {
    const { size, limit } = req.query;

    let filter = {};

    // Filter by price range (e.g., "200-300")
    if (size) {
      const [minPrice, maxPrice] = size.split("-").map(Number);

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filter.sizes = {
          $elemMatch: {
            price: { $gte: minPrice, $lte: maxPrice },
          },
        };
      }
    }

    const products = await Product.find(filter).limit(Number(limit) || 0);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.getAllProductFilter = async (req, res) => {
  try {
    const { category, limit } = req.query;

    // Create a filter object
    const filter = category ? { category } : {};

    // Find products by filter and apply limit if provided
    const products = await Product.find(filter).limit(Number(limit) || 0);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};


exports.getOneProduct = async (req, res) => {
  try {
    const newProduct = await Product.findById(req.params.id); // Avoid naming conflict

    res.status(201).json({
      success: true,
      product: newProduct, // Return the created product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message, // Send error message in response
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the URL parameters

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(id);

    // If the product doesn't exist, return a 404 error
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Return a success message if the product was deleted
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message, // Send the error message in the response
    });
  }
};
exports.getOneProductId = async (req, res) => {
  try {
    const { productId } = req.params; // Get productId from URL

    const product = await Product.findOne({ productId }); // Find by productId

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};
