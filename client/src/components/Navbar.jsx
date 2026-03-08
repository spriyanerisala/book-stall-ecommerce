/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaShoppingCart, FaClipboardList, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [openSettings, setOpenSettings] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear user info here if using context
    navigate("/login");
  };

  return (
    <nav className="bg-blue-400 text-white p-4 flex items-center justify-between shadow-md">
      
      {/* Left side - Links */}
      <div className="flex space-x-6 items-center">
        <Link to="/" className="flex items-center gap-1 hover:text-gray-200">
          <FaHome /> Home
        </Link>
        <Link to="/books" className="flex items-center gap-1 hover:text-gray-200">
          <FaBook /> Books Store
        </Link>
        <Link to="/my-orders" className="flex items-center gap-1 hover:text-gray-200">
          <FaClipboardList /> Orders
        </Link>
        <Link to="/cart" className="flex items-center gap-1 hover:text-gray-200">
          <FaShoppingCart /> Cart
        </Link>
      </div>

     
      <div className="relative">
        <button
          onClick={() => setOpenSettings(!openSettings)}
          className="flex items-center gap-1 hover:text-gray-200"
        >
          <FaUserCircle size={24} /> {/* Settings/Profile Icon */}
        </button>

        <AnimatePresence>
          {openSettings && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg overflow-hidden z-10"
            >
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
              >
                <FaSignOutAlt /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
