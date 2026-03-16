// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  console.log("Backend url in admin : ",API_URL);
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No admin token found");

      const res = await axios.get(`${API_URL}/api/admin/all-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 font-semibold">
        Loading orders...
      </div>
    );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-blue-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-blue-200 rounded-lg bg-white">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <OrderCard key={order.orderId} order={order} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;