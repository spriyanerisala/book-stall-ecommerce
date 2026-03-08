import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      title: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  orderStatus: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  
 
  paidAt: { type: Date },
  stripeSessionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;