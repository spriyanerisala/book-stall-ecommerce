// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import AdminLogin from './components/AdminLogin';
// import Products from './pages/Products';
// import Users from './pages/Users';
// import Orders from './pages/Orders';

// const App = () => {
//   return (
   

//   <Routes>

//     <Route path="/admin" element={<AdminLogin />} />

   
//     <Route
//       path="/*"
//       element={
//         <div className="flex">
//           <Sidebar />
//           <div className="flex-1">
//             <Navbar />
//             <Routes>
//               <Route path="products" element={<Products />} />
//               <Route path="users" element={<Users />} />
//               <Route path="orders" element={<Orders />} />
//             </Routes>
//           </div>
//         </div>
//       }
//     />

//   </Routes>


//   );
// }

// export default App;

import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminLogin from "./components/AdminLogin";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Orders from "./pages/Orders";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>

      {/* Admin Login */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin Panel */}
      <Route path="/admin" element={<Layout />}>
        <Route path="products" element={<Products />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
      </Route>

    </Routes>
  );
};

export default App;
