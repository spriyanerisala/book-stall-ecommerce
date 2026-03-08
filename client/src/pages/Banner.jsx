/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import bannerImage from "../assets/book_stall_banner.jpeg";
import { useNavigate } from "react-router-dom";
function Banner() {

    const navigate = useNavigate();
  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      
      {/* Banner Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[90vh] relative overflow-hidden"
      >
        <img
          src={bannerImage}
          alt="Home Banner"
          className="w-full h-full object-cover opacity-30"
        />

        {/* Optional overlay with text */}
        <div className="absolute inset-0  bg-opacity-10 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-900 font-serif">Welcome to Book Stall</h1>
          <p className="text-lg md:text-2xl text-blue-800 font-bold  font-mono mb-6">Find your favorite books at the best price!</p>
          <button onClick={()=>navigate('/books')} className="bg-blue-600 hover:bg-blue-700 cursor-pointer px-6 py-3 rounded text-white font-semibold">
            Explore Books
          </button>
        </div>
      </motion.div>     
    </div>
  );
}

export default Banner;
