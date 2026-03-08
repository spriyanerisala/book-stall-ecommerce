import Product from '../models/Product.js';
import User from '../models/User.js';
import Comment from "../models/Comment.js";
import Order from '../models/Order.js';
import {redis} from '../config/redis.js';
export const preloadProductsToRedis = async () => {
  try {
    const products = await Product.find().lean();

    if (!products.length) return console.log("No products to preload");

    const redisData = {};
    products.forEach(p => {
      redisData[p._id.toString()] = JSON.stringify(p);
    });

    await redis.hset("products", redisData);

    console.log(`Preloaded ${products.length} products into Redis`);
  } catch (err) {
    console.error(" Error preloading products to Redis:", err);
  }
};

export const preloadUsersToRedis = async () => {
  try {
    const users = await User.find().lean(); // fetch all users

    if (!users.length) return console.log("No users to preload");

    const redisData = {};
    users.forEach(user => {
      redisData[user._id.toString()] = JSON.stringify(user);
    });

    await redis.hset("users", redisData);

    console.log(`Preloaded ${users.length} users into Redis`);
  } catch (err) {
    console.error("Error preloading users to Redis:", err);
  }
};






export const preloadCommentsToRedis = async () => {
  try {
    const comments = await Comment.find().lean(); // fetch all comments

    if (!comments.length) return console.log("No comments to preload");

    const redisData = {};
    comments.forEach(comment => {
      redisData[comment._id.toString()] = JSON.stringify(comment);
    });

    await redis.hset("comments", redisData);

    console.log(`Preloaded ${comments.length} comments into Redis`);
  } catch (err) {
    console.error("Error preloading comments to Redis:", err);
  }
};



export const preloadRatingsLoader = async () => {
  try {
    const products = await Product.find()
      .populate("ratings.userId", "name email")
      .lean();

    const ratingsCache = {};

    products.forEach(product => {
      const ratingsArr = product.ratings || []; // safe default

      const avgRating =
        ratingsArr.length > 0
          ? ratingsArr.reduce((sum, r) => sum + r.rating, 0) / ratingsArr.length
          : 0;

      ratingsCache[product._id] = {
        productTitle: product.title,
        avgRating: avgRating.toFixed(2),
        ratings: ratingsArr.map(r => ({
          userId: r.userId?._id,
          username: r.userId?.name || "Unknown",
          rating: r.rating
        }))
      };
    });

    return ratingsCache;
  } catch (err) {
    console.error("preloadRatingsLoader error:", err);
    return {};
  }
};




export const preloadOrdersToRedis = async () => {
  try {
    const orders = await Order.find({ paymentStatus: "success" }).lean();

    if (!orders.length) {
      return console.log("No successful orders found");
    }

    const groupedOrders = {};

    orders.forEach(order => {
      const userId = order.userId.toString();

      if (!groupedOrders[userId]) {
        groupedOrders[userId] = [];
      }

      groupedOrders[userId].push(order);
    });

    // 🔥 THIS IS THE IMPORTANT FIX
    for (const userId in groupedOrders) {
      await redis.hset("orders", {
        [userId]: JSON.stringify(groupedOrders[userId])
      });
    }

    console.log("Orders preloaded into Redis successfully");

  } catch (err) {
    console.error("Error preloading orders:", err);
  }
};
