/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate} from "react-router-dom";
const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
useEffect(() => {
  const fetchBooks = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/all-products`,
      );

      setBooks(data.products); // ✅ NO Object.values
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  fetchBooks();
}, []);


  if (loading) {
    return <p className="text-center mt-10">Loading books...</p>;
  }

  if (!books.length) {
    return <p className="text-center mt-10">No books available</p>;
  }
    

  return (
    <div className="p-6">
      <h2 className="text-2xl text-blue-600 underline underline-offset-4 font-bold mb-6 text-center">Book Store</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {books.map((book) => (
          <motion.div
            key={book._id}
            className="bg-white cursor-pointer rounded-xl shadow-md overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              console.log("clicked book : ",book);
              console.log("book id  : ",book?._id);
  if (book?._id) {
    navigate(`/book/${book._id}`);
  }
}}

          >
        
            <img
              src={
                book.image ||
                "https://via.placeholder.com/300x400?text=No+Image"
              }
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-500">
                {book.category} / {book.subCategory}
              </p>
              <p className="mt-1 font-bold text-indigo-600">
                Rs.{book.price}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Books;
