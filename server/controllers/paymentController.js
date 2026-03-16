import Stripe from "stripe";
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import {redis} from '../config/redis.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const quantity = item.quantity || 1;

      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        image: product.image,   
      });

      totalAmount += product.price * quantity;
    }

     let order = await Order.findOne({
    userId,
    totalAmount,
    "items.productId": { $all: orderItems.map(i => i.productId) },
    paymentStatus: "pending"
  });

  if (!order) {
    
    order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      currency: "INR",
      paymentStatus: "pending"
    });
  }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: orderItems.map(item => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: "https://book-stall-ecommerce-client.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://book-stall-ecommerce-client.vercel.app/cancel",
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({ success: true, url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: "Webhook error" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    
    if (order.paymentStatus !== "success") {
      order.paymentStatus = "success";
      order.paymentIntentId = session.payment_intent;
      order.paidAt = new Date();
      await order.save();
      console.log("Payment success updated:", order._id);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const order = await Order.findById(orderId);

    if (order && order.paymentStatus !== "failed") {
      order.paymentStatus = "failed";
      await order.save();
    }
  }

  res.status(200).json({ received: true });
};