import Comment from "../models/Comment.js";
import {redis } from '../config/redis.js';
import Product from "../models/Product.js";

export const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const redisKey = `comments:${productId}`;

    // 🔹 Check Redis First
    const cachedComments = await redis.get(redisKey);

   if (cachedComments) {
  return res.json({
    success: true,
    source: "redis",
    comments:
  typeof cachedComments === "string"
    ? JSON.parse(cachedComments)
    : cachedComments || [],

  });
} 

console.log("TYPE : " ,typeof cachedComments);
console.log("Value : ",cachedComments);


    // 🔹 Fetch From DB
    const comments = await Comment.find({ productId })
      .populate("userId","name")
      .sort({ createdAt: -1 })
      .lean();


      console.log("comments : ",comments);

    // 🔹 Store in Redis
    await redis.set(redisKey, JSON.stringify(comments));

    res.json({
      success: true,
      source: "db",
      comments,
    });

  } catch (err) {
    console.log("GET COMMENTS ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message,
  });
  }
};

export const addComment = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.body.text || req.body.text.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment text required" });
    }

    const comment = await Comment.create({
      productId,
      userId: req.userId,
      text: req.body.text,
      rating: req.body.rating || undefined,
    });

    // Recalculate average rating for the product
    const allRatings = await Comment.find({ productId, rating: { $exists: true } }).select("rating");
    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
        : 0;

    // Clear cache
    await redis.del(`comments:${productId}`);

    res.json({ success: true, comment, avgRating });
  } catch (err) {
    console.log("ADD COMMENT ERROR:", err);
    res.status(500).json({ success: false, message: "Error adding comment" });
  }
};


export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not allowed" });

    const { text, rating } = req.body;

    if (text && text.trim() !== "") comment.text = text;

    if (rating && Number(rating) >= 1 && Number(rating) <= 5) {
      comment.rating = Number(rating);

      // Update Product ratings array
      const product = await Product.findById(comment.productId);

      const ratingIndex = product.ratings.findIndex(
        r => r.userId.toString() === req.user.userId
      );

      if (ratingIndex !== -1) {
        product.ratings[ratingIndex].rating = Number(rating);
      } else {
        product.ratings.push({ userId: req.user.userId, rating: Number(rating) });
      }

      // Recalculate average
      const allRatings = product.ratings.map(r => r.rating);
      const avgRating =
        allRatings.length > 0
          ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
          : 0;

      product.avgRating = avgRating.toFixed(2);
      await product.save();

      // Clear cached product
      await redis.hdel("products", comment.productId);
    }

    await comment.save();

    // Clear comment cache
    await redis.del(`comments:${comment.productId}`);

    res.json({ success: true, comment });
  } catch (err) {
    console.log("UPDATE COMMENT ERROR:", err);
    res.status(500).json({ message: "Error updating comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not allowed" });

    await comment.deleteOne();

    // 🔹 Clear Cache
    await redis.del(`comments:${comment.productId}`);

    res.json({
      success: true,
      message: "Deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting comment",
    });
  }
};

