/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          ❌ Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was not completed.  
          If this was a mistake, you can try again.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Cancel;
