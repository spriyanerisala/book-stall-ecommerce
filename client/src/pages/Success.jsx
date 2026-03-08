/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Success = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedProduct = localStorage.getItem("lastPurchasedProduct");
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          🎉 Payment Successful!
        </h1>

        {product && (
          <div className="mb-6">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-semibold mb-2">
              {product.title}
            </h2>

            <p className="text-lg font-bold text-indigo-600">
              ₹{product.price}
            </p>
          </div>
        )}

        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("lastPurchasedProduct");
            navigate("/");
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default Success;
