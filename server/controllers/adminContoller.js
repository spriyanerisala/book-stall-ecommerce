import User from '../models/User.js';
import Product from '../models/Product.js';
import {redis} from '../config/redis.js';
import Order from '../models/Order.js';
import {cloudinary} from '../config/cloudinary.js';

// export const getAllUsers = async (req, res) => {
//   try {

//     let usersHash = await redis.hgetall("users");

//     // 🔥 If Redis empty → fetch from MongoDB
//     if (!usersHash || Object.keys(usersHash).length === 0) {

//       console.log("Redis empty → fetching users from MongoDB");

//       const usersFromDB = await User.find().select("-password");

//       if (!usersFromDB.length) {
//         return res.status(404).json({
//           success: false,
//           message: "No users found"
//         });
//       }

//       const redisData = {};

//       usersFromDB.forEach(user => {
//         redisData[user.email] = JSON.stringify({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role
//         });
//       });

//       await redis.hset("users", redisData);

//       usersHash = redisData;
//     }

//     // 🔥 Convert JSON → objects
//     const formattedUsers = {};

//     for (const [email, value] of Object.entries(usersHash)) {
//       try {
//         formattedUsers[email] =
//           typeof value === "string" ? JSON.parse(value) : value;
//       } catch (err) {
//         console.warn(`Invalid JSON for user ${email}`);
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "All users fetched successfully",
//       users: formattedUsers
//     });

//   } catch (err) {
//     console.error("Error fetching users:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching users"
//     });
//   }
// };

// --- Fetch all tokens ---
export const getAllUsers = async (req, res) => {
  try {
    let usersHash = await redis.hgetall("users");

    if (!usersHash || Object.keys(usersHash).length === 0) {
      const users = await User.find().select("-password").lean();

      if (!users.length) {
        return res.status(404).json({ success: false, message: "No users found" });
      }

      const redisData = {};
      users.forEach(user => {
        redisData[user._id.toString()] = JSON.stringify(user);
      });

      await redis.hset("users", redisData);
      usersHash = redisData;
    }

    const formattedUsers = [];

    for (const [id, value] of Object.entries(usersHash)) {
      try {
        formattedUsers.push(JSON.parse(value));
      } catch {
        await redis.hdel("users", id);
      }
    }

    res.json({ success: true, users: formattedUsers });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// export const getAllTokens = async (req, res) => {
//   try {

//     // 🔥 Get all token keys
//     const tokenKeys = await redis.keys("token:*");

//     if (!tokenKeys || tokenKeys.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No tokens available",
//         tokens: {}
//       });
//     }

//     const formattedTokens = {};

//     // 🔥 Fetch each token
//     for (const key of tokenKeys) {

//       const token = await redis.get(key);

//       // extract email from key
//       const email = key.replace("token:", "");

//       formattedTokens[email] = token;
//     }

//     return res.status(200).json({
//       success: true,
//       message: "All tokens fetched successfully",
//       tokens: formattedTokens
//     });

//   } catch (err) {
//     console.error("Error fetching tokens:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching tokens"
//     });
//   }
// };
export const getAllTokens = async (req, res) => {
  try {
    const keys = await redis.keys("token:*");

    const tokens = {};

    for (const key of keys) {
      const token = await redis.get(key);
      const email = key.replace("token:", "");
      tokens[email] = token;
    }

    res.json({ success: true, tokens });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const clearAllTokensHash = async (req, res) => {
  try {
    await redis.del("tokens");
    return res.status(200).json({ success: true, message: "All tokens cleared" });
  } catch (err) {
    console.error("Error clearing tokens:", err);
    return res.status(500).json({ success: false, message: "Error clearing tokens" });
  }
}; 



export const deleteSingleToken = async (req, res) => {
  try {
    const { email } = req.params;
    const key = `token:${email.toLowerCase()}`;

    await redis.del(key);

    res.json({ success: true, message: "Token deleted" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearAllUsersHash = async (req, res) => {
  try {
    await redis.del("users");

    return res.status(200).json({
      success: true,
      message: "All users cleared from users folder"
    });

  } catch (err) {
    console.error("Error clearing users:", err);
    return res.status(500).json({
      success: false,
      message: "Error clearing users"
    });
  }
};


export const deleteSingleUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email)
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });

    const emailKey = email.trim().toLowerCase();

    await redis.hdel("users", emailKey);

    return res.status(200).json({
      success: true,
      message: `User deleted from redis: ${emailKey}`
    });

  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({
      success: false,
      message: "Error deleting user"
    });
  }
};




export const getActiveCartsWithUserInfo = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const keys = await redis.keys("cart:*");
    const carts = [];

    for (const key of keys) {
      const cartData = await redis.get(key);
      if (!cartData) continue;

      const userId = key.split(":")[1];

      const user = await User.findById(userId).select("name email").lean();
      if (!user) continue;

      let cart;
      try {
        cart = JSON.parse(cartData); // parse safely
      } catch {
        console.log(`Invalid JSON for key ${key}, skipping`);
        continue;
      }

      carts.push({
        userId,
        name: user.name,
        email: user.email,
        cart
      });
    }

    res.json({ success: true, carts });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    let { title, category, subCategory, description, price, stock } = req.body;

    if (!title || !category || !subCategory || !description || !price) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    price = Number(price);
    stock = Number(stock || 0);

    let image = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }

    const product = await Product.create({
      title,
      category,
      subCategory,
      description,
      price,
      stock,
      image
    });

    await redis.hset("products", {
      [product._id.toString()]: JSON.stringify(product.toObject())
    });

    res.status(201).json({ success: true, product });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// export const getAllProducts = async (req, res) => {
//   try {
//     let productsHash = await redis.hgetall("products");

//     if (!productsHash || Object.keys(productsHash).length === 0) {
//       const products = await Product.find().lean();

//       const redisData = {};
//       products.forEach(p => {
//         redisData[p._id.toString()] = JSON.stringify(p);
//       });

//       await redis.hset("products", redisData);
//       productsHash = redisData;
//     }

//     const products = [];

//     for (const [id, value] of Object.entries(productsHash)) {
//       try {
//         products.push(JSON.parse(value));
//       } catch {
//         await redis.hdel("products", id);
//       }
//     }

//     res.json({ success: true, products });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getAllProducts = async (req, res) => {
//   try {
//     let productsHash = await redis.hgetall("products");
//     let products = [];

//     // If cache exists
//     if (productsHash && Object.keys(productsHash).length > 0) {
//       for (const [id, value] of Object.entries(productsHash)) {
//         try {
//           const parsed = JSON.parse(value);
//           products.push(parsed);
//         } catch (err) {
//           console.log(`Skipping invalid Redis data for product ${id}`);
//           // Do NOT delete immediately, just skip it
//         }
//       }
//     }

//     // If cache empty or all entries invalid
//     if (products.length === 0) {
//       const dbProducts = await Product.find().lean();

//       if (dbProducts.length === 0) {
//         return res.status(404).json({ success: false, message: "No products found" });
//       }

//       const redisData = {};
//       dbProducts.forEach(p => {
//         redisData[p._id.toString()] = JSON.stringify(p);
//       });

//       await redis.hset("products", redisData);
     
//       products = dbProducts;
//     }

//     res.json({ success: true, products });

//   } catch (err) {
//     console.error("Error in getAllProducts:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
// export const getAllProducts = async (req, res) => {
//   try {
//     let productsHash = await redis.hgetall("products");
//     let products = [];

//     if (productsHash && Object.keys(productsHash).length > 0) {
//       for (const [id, value] of Object.entries(productsHash)) {
//         try {
//           products.push(JSON.parse(value));
//         } catch (err) {
//           console.log(`Deleting invalid Redis data for product ${id}`);
          
//         }
//       }
//     }

//     if (products.length === 0) {
//       const dbProducts = await Product.find().lean();

//       if (!dbProducts.length) {
//         return res.status(404).json({ success: false, message: "No products found" });
//       }

//       const redisData = {};
//       dbProducts.forEach(p => {
//         redisData[p._id.toString()] = JSON.stringify(p);
//       });

//       await redis.hset("products", redisData);
//       products = dbProducts;
//     }

//     res.json({ success: true, products });

//   } catch (err) {
//     console.error("Error in getAllProducts:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
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
export const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let cached = await redis.hget("products", id);

    if (cached) {
      try {
        return res.json({ success: true, product: JSON.parse(cached), source: "cache" });
      } catch {
        await redis.hdel("products", id);
      }
    }

    const product = await Product.findById(id)
      .populate("ratings.userId", "name email")
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const ratings = product.ratings || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    product.avgRating = avgRating.toFixed(2);

    await redis.hset("products", product._id.toString(), JSON.stringify(product));

    res.json({ success: true, product, source: "db" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.stock) req.body.stock = Number(req.body.stock);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.image = result.secure_url;
    }

    const updatedProduct = await Product
      .findByIdAndUpdate(productId, req.body, { new: true })
      .lean();

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await redis.hset("products", {
      [productId]: JSON.stringify(updatedProduct)
    });
   

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await redis.hdel("products", productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const addOrUpdateRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating } = req.body;
    const userId = req.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be 1-5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const index = product.ratings.findIndex(
      r => r.userId?.toString() === userId
    );

    if (index >= 0) {
      product.ratings[index].rating = rating;
    } else {
      product.ratings.push({ userId, rating });
    }

    await product.save();

    const updatedProduct = await Product.findById(productId).lean();

    await redis.hset("products", {
      [productId]: JSON.stringify(updatedProduct)
    });

    res.json({ success: true, message: "Rating updated" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const clearProductsRedis = async (req, res) => {
  try {
    const result = await redis.del("products");

    return res.status(200).json({
      success: true,
      message: result
        ? "Products cache cleared"
        : "Products cache not found"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




export const showCache = async (req,res)=>{
  try{

    const keys = await redis.keys("*");
    const data = {};

    for(const key of keys){

      // ✅ check redis key type first
      const type = await redis.type(key);

      // 🟢 HANDLE HASH KEYS
      if(type === "hash"){

        const hashData = await redis.hgetall(key);
        const formatted = {};

        for(const [field,value] of Object.entries(hashData)){

          try{
            formatted[field] = JSON.parse(value);
          }catch(err){
            formatted[field] = value;
          }
        }

        data[key] = formatted;
      }

      // 🟢 HANDLE STRING KEYS
      else if(type === "string"){

        const value = await redis.get(key);

        try{
          data[key] = JSON.parse(value);
        }catch(err){
          data[key] = value;
        }
      }

      // 🟢 OTHER TYPES (optional future safety)
      else{
        data[key] = `Unsupported Redis type: ${type}`;
      }
    }

    return res.json({
      success:true,
      message:"Redis cache data",
      data
    });

  }catch(err){
    console.log("showCache error:",err);
    return res.status(500).json({
      success:false,
      message:"Error in show cache"
    });
  }
}



export const deleteRating = async (req, res) => {
  try {
    const { productId } = req.params; // ✅ productId from URL
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Remove user's rating
    product.ratings = product.ratings.filter(r => r.userId.toString() !== userId);

    await product.save();

    // Update Redis cache
    await redis.hset("products", { [productId]: JSON.stringify(product) });

    const avgRating = product.ratings.length
      ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length
      : 0;

    res.json({ success: true, message: "Rating deleted", product, avgRating });

  } catch (err) {
    console.error("deleteRating error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};





export const getAllRatings = async (req, res) => {
  try {
    // Fetch all products with populated ratings.userId
    const products = await Product.find()
      .populate("ratings.userId", "name email") // populate user info
      .lean();

    const allRatings = [];

    products.forEach(product => {
      const ratingsArr = product.ratings || []; // ✅ safe default

      const avgRating =
        ratingsArr.length > 0
          ? ratingsArr.reduce((sum, r) => sum + r.rating, 0) / ratingsArr.length
          : 0;

      ratingsArr.forEach(r => {
        allRatings.push({
          productId: product._id,
          productTitle: product.title,
          userId: r.userId?._id,
          username: r.userId?.name || "Unknown",
          rating: r.rating,
          avgRating: avgRating.toFixed(2)
        });
      });

      // If product has no ratings, still show avgRating
      if (ratingsArr.length === 0) {
        allRatings.push({
          productId: product._id,
          productTitle: product.title,
          userId: null,
          username: null,
          rating: null,
          avgRating: 0
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "All ratings fetched successfully",
      ratings: allRatings
    });
  } catch (err) {
    console.error("getAllRatings error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



export const getAllOrders = async (req, res) => {
  try {
   

    const cacheKey = "cache:orders";
    let ordersCache;

    try {
      ordersCache = await redis.get(cacheKey);
    } catch (err) {
      console.log("Redis key type mismatch, deleting old key");
      await redis.del(cacheKey);
      ordersCache = null;
    }

    if (ordersCache) {
      return res.json({ success: true, orders: JSON.parse(ordersCache), cached: true });
    }

    const orders = await Order.find()
      .populate("userId", "name email address")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      user: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      paidAt: order.paidAt,
      stripeSessionId: order.stripeSessionId,
      createdAt: order.createdAt,
    }));

    // Upstash-compliant set with TTL
    await redis.hset(cacheKey, JSON.stringify(formattedOrders), { ex: 300 });

    res.json({ success: true, orders: formattedOrders, cached: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};