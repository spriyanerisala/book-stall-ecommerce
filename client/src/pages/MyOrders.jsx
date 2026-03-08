
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      if (!token) {
        toast.error("Please login");
        navigate("/login");
        return;
      }
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("my orders url :", `${import.meta.env.VITE_API_URL}/api/orders/my-orders`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleCheckout = async (item) => {
    try {
      if (!token) return navigate("/login");

      setLoading(true);
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
        { items: [item] }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.url) {
        window.location.href = res.data.url; 
      } else {
        toast.error("Payment failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
        📦 My Orders
      </h2>

      {orders.length === 0 ? (
        <h4 className="text-center text-blue-500 text-lg">
          You have no orders yet
        </h4>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-8 ${
                order.paymentStatus === "success" ? "border-indigo-600" : "border-red-400"
              }`}
            >
              
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-indigo-900">
                  Order ID: {order._id}
                </h4>
                <span
                  className={`px-4 py-1 rounded-lg text-white font-semibold ${
                    order.paymentStatus === "success"
                      ? "bg-indigo-600"
                      : order.paymentStatus === "failed"
                      ? "bg-red-500"
                      : "bg-yellow-400"
                  }`}
                >
                  {order.paymentStatus === "success"
                    ? "Paid"
                    : order.paymentStatus === "failed"
                    ? "Failed"
                    : "Pending"}
                </span>
              </div>

             
              <div className="space-y-5">
                {order.items?.map((item) => (
                  <motion.div
                    key={item.productId}
                    className="flex items-center gap-6 border-b border-gray-200 pb-4"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/300x400?text=No+Image"}
                      alt={item.title}
                      className="w-28 h-28 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-indigo-900">{item.title}</h4>
                      <p className="text-indigo-600 font-medium">Price: ₹{item.price}</p>
                      <p className="text-blue-500">Quantity: {item.quantity}</p>

                     
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded-lg text-white text-sm ${
                            order.paymentStatus === "success"
                              ? "bg-green-600"
                              : order.paymentStatus === "failed"
                              ? "bg-red-500"
                              : "bg-yellow-400"
                          }`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-lg text-white text-sm ${
                            order.orderStatus === "confirmed"
                              ? "bg-indigo-600"
                              : order.orderStatus === "pending"
                              ? "bg-yellow-400"
                              : "bg-red-500"
                          }`}
                        >
                          Order: {order.orderStatus}
                        </span>
                      </div>

                     
                      {order.paymentStatus === "pending" && (
                        <button
                          disabled={loading}
                          className={`mt-3 px-4 py-2 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                          } text-white rounded transition`}
                          onClick={() => handleCheckout(item)}
                        >
                          {loading ? "Processing..." : "Pay Now"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

             
              <div className="flex justify-between mt-6 font-semibold text-indigo-700">
                <span>Total: ₹{order.totalAmount}</span>
                <span>{order.paidAt ? new Date(order.paidAt).toLocaleString() : "Payment Pending"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;