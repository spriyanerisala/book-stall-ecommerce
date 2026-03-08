import Product from "../models/Product.js";
import { redis } from "../config/redis.js";


// ===============================
// 1️⃣ GET ALL PRODUCTS (Cached)
// ===============================
export const getAllProducts = async (req, res) => {
  try {
    let products = [];

    // 1️⃣ Try to get from Redis
    const productsHash = await redis.hgetall("products");

    if (productsHash && Object.keys(productsHash).length > 0) {
      for (const [id, value] of Object.entries(productsHash)) {
        try {
          const parsed = JSON.parse(value);

          // Extra safety check
          if (parsed && parsed._id) {
            products.push(parsed);
          } else {
            // delete invalid structure
            await redis.hdel("products", id);
          }

        } catch (err) {
          
          await redis.hdel("products", id);
        }
      }
    }

    // 2️⃣ If Redis empty → Fetch from MongoDB
    if (products.length === 0) {
      const dbProducts = await Product.find().lean();

      if (!dbProducts.length) {
        return res.status(404).json({
          success: false,
          message: "No products found",
        });
      }

      // Store correctly in Redis
      const redisData = {};

      for (const product of dbProducts) {
        redisData[product._id.toString()] = JSON.stringify(product);
      }

      await redis.hset("products", redisData);

      products = dbProducts;
    }

    return res.json({ success: true, products });

  } catch (err) {
    console.error("Error in getAllProducts:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// ===============================
// 2️⃣ GET ONE PRODUCT (Cached)
// ===============================
export const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check Redis first
    const cachedProduct = await redis.hget("products", id);

    if (cachedProduct) {
      return res.json({
        success: true,
        product: JSON.parse(cachedProduct),
      });
    }

    // Fetch from DB
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Store in Redis
    await redis.hset("products", id, JSON.stringify(product));

    res.json({ success: true, product });
  } catch (err) {
    console.error("Error in getOneProduct:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ===============================
// 3️⃣ ADD OR UPDATE RATING
// ===============================
export const addOrUpdateRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // from authMiddleware

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingRating = product.ratings.find(
      (r) => r.user.toString() === userId
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      product.ratings.push({
        user: userId,
        rating,
        comment,
      });
    }

    // Recalculate average rating
    const total = product.ratings.reduce((acc, r) => acc + r.rating, 0);
    product.averageRating = total / product.ratings.length;

    await product.save();

    // 🔥 Invalidate cache
    await redis.del("products");

    res.json({
      success: true,
      message: "Rating added/updated successfully",
      product,
    });
  } catch (err) {
    console.error("Error in addOrUpdateRating:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ===============================
// 4️⃣ DELETE RATING
// ===============================
export const deleteRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.ratings = product.ratings.filter(
      (r) => r.user.toString() !== userId
    );

    // Recalculate average rating
    if (product.ratings.length > 0) {
      const total = product.ratings.reduce((acc, r) => acc + r.rating, 0);
      product.averageRating = total / product.ratings.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();

    // 🔥 Invalidate cache
    await redis.del("products");

    res.json({
      success: true,
      message: "Rating deleted successfully",
      product,
    });
  } catch (err) {
    console.error("Error in deleteRating:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};