
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
 const API_URL = import.meta.env.VITE_API_URL;
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
 
  //     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, form, {
  //       withCredentials: true, 
  //     });

  //     const user = res.data.user;

  //     if (user.role === "admin") {
  //       localStorage.setItem("adminToken", res.data.token || "fake-admin-token");
  //       toast.success("Admin login successful");
  //       navigate("/admin/dashboard"); // admin panel route
  //     } else {
  //       toast.success("Login successful");
  //       localStorage.setItem("userToken", res.data.token || "fake-user-token");
  //       navigate("/dashboard"); // normal user route
  //     }

  //   } catch (err) {
  //     console.log(err);
  //     const msg = err.response?.data?.message || "Login failed";
  //     setError(msg);
  //     toast.error(msg);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const res = await axios.post(
      `${API_URL}/api/auth/login`,
      form,
      {
        withCredentials: true,
      }
    );

    const user = res.data.user;

    if (user.role === "admin") {

      localStorage.setItem("adminToken", res.data.token);

      toast.success("Admin login successful");

      navigate("/admin/products");   // redirect to admin panel

    } else {

      toast.error("You are not an admin");

    }

  } catch (err) {

    console.log(err);

    const msg = err.response?.data?.message || "Login failed";

    setError(msg);

    toast.error(msg);

  }
};
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;