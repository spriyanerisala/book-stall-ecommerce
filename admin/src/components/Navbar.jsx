/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
const Navbar = () => {

 const navigate = useNavigate();
  const handleLogout =()=>{
    const token = localStorage.getItem("adminToken");
    if(token){
      localStorage.removeItem("adminToken");
      toast.success("Logged out successfully");
      navigate('/admin');
    }
  }
  return (
    <motion.div 
      className="w-full h-16 bg-gray-300  text-blue-800 flex items-center px-6"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-xl    font-bold">Admin Panel</h1>
      <button onClick={handleLogout} className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
    </motion.div>
  );
};

export default Navbar;