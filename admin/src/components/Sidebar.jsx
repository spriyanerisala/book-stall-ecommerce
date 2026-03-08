import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 px-4 py-6">
      <nav className="flex flex-col gap-4">
       
        <Link to="/products" className="text-primary font-semibold">Products</Link>
        <Link to="/users" className="text-primary font-semibold">Users</Link>
        <Link to="/orders" className="text-primary font-semibold">Orders</Link>
       
      </nav>
    </div>
  );
};

export default Sidebar;