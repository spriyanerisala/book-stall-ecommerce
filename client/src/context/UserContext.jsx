
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const UserContext = createContext();

const API_URL = import.meta.env.VITE_API_URL

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser({ ...JSON.parse(storedUser), token: storedToken });
    }

    setLoading(false);
  }, []);

  // ---------------- SIGNUP ----------------
  const signup = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setUser({ ...res.data.user, token: res.data.token });

      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Signup failed" };
    }
  };

  // ---------------- LOGIN ----------------
  const login = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setUser({ ...res.data.user, token: res.data.token });

      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Login failed" };
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const firebaseUser = result.user;
    const idToken = await firebaseUser.getIdToken();

    const res = await axios.post(
      `${API_URL}/api/auth/oauth-login`,
      { idToken }
    );

    console.log("BACKEND RESPONSE:", res.data);

    const { user, token } = res.data;

    if (!token) {
      throw new Error("JWT not received from backend");
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    console.log("TOKEN AFTER SAVE:", localStorage.getItem("token"));

    setUser({ ...user, token });

    return { ...user, token };

  } catch (err) {
    console.error("Google login failed:", err);
    throw err;
  }
};
  // ---------------- LOGOUT ----------------
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
          `${API_URL}/api/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.warn("Logout API failed:", err.message);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);