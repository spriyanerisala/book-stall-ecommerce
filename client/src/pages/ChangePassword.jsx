/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
function ChangePassword() {
  const { changePassword } = useUser();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await changePassword(oldPassword, newPassword);
      toast.success("Changed Password Successfully");
      setMessage(res.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
        toast.error("Changed Password failed");
      setError(err.message || "Change password failed");
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
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>

        {message && (
          <motion.p
            className="text-green-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
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
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          whileFocus={{ scale: 1.02 }}
        />

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
          className="w-full bg-blue-600 text-white p-3 rounded mb-2 hover:bg-blue-700"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Change Password
        </motion.button>

        <motion.button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full bg-gray-400 text-white p-3 rounded hover:bg-gray-500 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Back To Login
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default ChangePassword;
