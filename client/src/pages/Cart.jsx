/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart/get-cart-items`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.cartItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to fetch cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update-cart-item`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error("Failed to update quantity");
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/delete-cart-item/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item removed");
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };


const handleCheckout = async (item) => {
  try {
    if (!token) {
      toast.error("Please Login");
      navigate("/login");
      return;
    }

    if (!item) {
      toast.error("Item not found");
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
      {
        items: [
          {
            productId: item.productId,   
            quantity: item.quantity,    
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.url) {
      window.location.href = response.data.url;
    } else {
      toast.error("Failed to create checkout session");
    }

  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message);
    toast.error(
      error.response?.data?.message || "Payment failed. Try again."
    );
  }
};

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <h4>Your cart is empty</h4>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.productId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                width="90"
                height="90"
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />

              <div style={{ flex: 1 }}>
                <h4>{item.title}</h4>
                <p>Rs. {item.price}</p>
              </div>

              <div>
                <button
                  className="bg-green-600"
                  onClick={() => handleCheckout(item)}
                  style={{
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  Buy Now
                </button>

                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  style={{ padding: "5px 10px" }}
                >
                  -
                </button>

                <span style={{ margin: "0 10px" }}>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  style={{ padding: "5px 10px" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                style={{
                  color: "white",
                  backgroundColor: "red",
                  border: "none",
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <hr />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Total: Rs. {totalPrice}</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
