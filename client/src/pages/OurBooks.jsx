/* eslint-disable no-unused-vars */


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import BookCard from "./BookCard";

const OurBooks = () => {
  const [books, setBooks] = useState([]);
  const carouselRef = useRef();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/all-products`);
        console.log("Our books : ",data);
        setBooks(Object.values(data.products || {}).slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  if (!books.length) return <p className="text-center mt-10">No books available</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Our Books</h2>
      <motion.div ref={carouselRef} className="flex space-x-6 overflow-x-auto scrollbar-none snap-x snap-mandatory cursor-grab" drag="x" dragConstraints={{ left: -1000, right: 0 }}>
        {books.map((book) => (
          <BookCard key={book._id} book={book} className="flex-shrink-0 w-56 h-[400px] snap-start" />
        ))}
      </motion.div>
    </div>
  );
};

export default OurBooks;
