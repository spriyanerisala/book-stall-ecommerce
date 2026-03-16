import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminLogin from "./components/AdminLogin";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Orders from "./pages/Orders";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>

      {/* First Page → Login */}
      <Route path="/" element={<AdminLogin />} />

      {/* Admin Pages */}
      <Route
        path="/products"
        element={
          <Layout>
            <Products />
          </Layout>
        }
      />

      <Route
        path="/users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />

      <Route
        path="/orders"
        element={
          <Layout>
            <Orders />
          </Layout>
        }
      />

    </Routes>
  );
};

export default App;