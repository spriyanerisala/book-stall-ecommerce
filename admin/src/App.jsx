import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminLogin from './components/AdminLogin';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './pages/Orders';

const App = () => {
  return (
   

  <Routes>

    {/* Admin Login Only */}
    <Route path="/admin" element={<AdminLogin />} />

    {/* Admin Layout */}
    <Route
      path="/*"
      element={
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <Routes>
              <Route path="products" element={<Products />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
            </Routes>
          </div>
        </div>
      }
    />

  </Routes>


  );
}

export default App;