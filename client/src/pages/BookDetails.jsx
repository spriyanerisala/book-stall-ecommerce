/* eslint-disable no-unused-vars */


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Comments from "../components/Comments";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/get-one-product/${id}`);
        setBook(data.product);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch book");
      }
    };
    fetchBook();
  }, [id]);


  const handlePlaceOrder = async () => {
  try {
    if (!token) {
      toast.error("Please login");
      navigate("/login");
      return;
    }

    if (!book) {
      toast.error("Book not loaded");
      return;
    }

    // Prepare payload
    const orderData = {
      items: [
        {
          productId: book._id,
          title: book.title,
          price: Number(book.price),
          quantity: 1,
          image: book.image
        }
      ],
      totalAmount: Number(book.price),
      currency: "INR"
    };

    // Call backend
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders/place-order`,
      orderData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      toast.success("Order placed successfully");
      navigate("/my-orders"); // redirect to orders page
    } else {
      toast.error(res.data.message || "Failed to place order");
    }
  } catch (err) {
    console.error("Place order error:", err);
    toast.error("Failed to place order");
  }
};
  const handleAddToCart = async () => {
    try {
      if (!token) return navigate("/login");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add-to-cart`,
        { productId: book._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to Cart");
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add to cart",err);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!token) return navigate("/login");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
        { items: [{ productId: book._id, title: book.title, price: book.price, quantity: 1 }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.url) window.location.href = res.data.url;
      else toast.error("Payment failed");
    } catch (err) {
      toast.error("Checkout failed",err);
    }
  };

  if (!book) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-10 p-10">
      {/* Left */}
      <div className="md:w-1/2 w-full flex flex-col gap-8">
        <motion.img
          src={book.image}
          alt={book.title}
          className="w-full h-[300px] object-cover rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        />
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-100 p-6 rounded-xl shadow">
          <Comments productId={book._id} />
        </motion.div>
      </div>

      {/* Right */}
      <motion.div className="md:w-1/2 w-full flex flex-col justify-center" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
        <p className="text-gray-600 mb-5">{book.description}</p>
        <p className="text-lg font-semibold mb-2">Category: {book.category}</p>
        <p className="text-3xl font-bold text-indigo-600 mb-8">Rs.{book.price}</p>

        <div className="flex gap-4">
          <motion.button className="bg-yellow-500 px-7 py-3 rounded-xl text-white font-semibold shadow" whileHover={{ scale: 1.05 }} onClick={handleAddToCart}>
            Add To Cart
          </motion.button>
          <motion.button className="bg-gray-500 px-7 py-3 rounded-xl text-white font-semibold shadow" whileHover={{ scale: 1.05 }} onClick={handlePlaceOrder}>
           Order
          </motion.button>
          <motion.button className="bg-indigo-600 px-7 py-3 rounded-xl text-white font-semibold shadow" whileHover={{ scale: 1.05 }} onClick={handleCheckout}>
            Buy Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetails;