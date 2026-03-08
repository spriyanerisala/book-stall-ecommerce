import Order from '../models/Order.js';
import {redis} from '../config/redis.js';


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    // 1️⃣ Try fetching from Redis
    const cached = await redis.hget("orders", userId);

    if (cached) {
      try {
        console.log("Fetched from Redis");
        return res.json(JSON.parse(cached)); // safe now
      } catch (err) {
        console.log("Corrupted cache detected, clearing...");
        await redis.hdel("orders", userId);
      }
    }

    // 2️⃣ Fetch from MongoDB
    const orders = await Order.find({
      userId: userId,
      
    }).lean();

    // 3️⃣ Save in Redis
    if (orders.length > 0) {
      await redis.hset("orders", {
        [userId]: JSON.stringify(orders), // MUST stringify
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




// ================= Place Order =================
export const placeOrder = async (req, res) => {
  const { items,totalAmount} = req.body;
  const userId = req.userId;
  try {
    // Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!totalAmount) {
      return res.status(400).json({ message: "Total amount is required" });
    }

    // Create new order
    const order = await Order.create({
      userId: userId,       // logged in user
      items,
      totalAmount,
      currency :"INR",
      orderStatus: "confirmed",   // order placed
      paymentStatus: "pending",   // payment pending until Stripe completes
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(500).json({ message: "Server error while placing order" });
  }
};