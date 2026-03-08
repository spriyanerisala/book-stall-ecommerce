/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
function ResetPassword() {
  const { resetPassword } = useUser();
  const { token } = useParams(); //get token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await resetPassword(token, newPassword);
      setSuccess(res.message);
      toast.success("Reset Password Successfully");
      setNewPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
         toast.error("Reset Password  failed");
      setError(err.message || "Reset failed");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {success && (
          <motion.p
            className="text-green-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {success}
          </motion.p>
        )}

        {error && (
          <motion.p
            className="text-red-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <motion.input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 mb-2 rounded hover:bg-blue-700"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Reset Password
        </motion.button>

        <motion.button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full bg-gray-400 text-white p-3 rounded hover:bg-gray-500"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Back To Login
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default ResetPassword;
