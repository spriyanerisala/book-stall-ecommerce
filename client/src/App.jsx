import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Books from './pages/Books.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Cart from './pages/Cart.jsx';
import BuyNow from './pages/BuyNow.jsx';
import Success from './pages/Success.jsx';
import Cancel from './pages/Cancel.jsx';
import MyOrders from './pages/MyOrders.jsx';
const App = () => {
  return (
    <Routes>
      <Route  path='/' element={<Home/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/forgot-password'  element={<ForgotPassword/>} />
       <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

       <Route path='/books' element={<Books/>} />
       <Route path='/book/:id' element={<BookDetails />} />
       <Route path='/cart' element={<Cart/>} />
       <Route path='/buy-now' element={<BuyNow/>} />
       <Route path='/my-orders' element={<MyOrders/>} />


       
       <Route path='/success' element={<Success/>} />
       <Route path='/cancel' element={<Cancel/>} />
      
    </Routes>
  )
}

export default App