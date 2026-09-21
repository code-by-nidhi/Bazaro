import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import CategoryProducts from './pages/public/CategoryProducts';
import ProductDetails from './pages/public/ProductDetails';
import SearchResults from './pages/public/SearchResults';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import NotFound from './pages/public/NotFound';

import AuthPage from './pages/auth/AuthPage';
import ForgotPassword from './pages/auth/ForgotPassword';

import Profile from './pages/user/Profile';
import EditProfile from './pages/user/EditProfile';
import MyOrders from './pages/user/MyOrders';
import OrderDetails from './pages/user/OrderDetails';
import Wishlist from './pages/user/Wishlist';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import AddressManagement from './pages/user/AddressManagement';
import PaymentSuccess from './pages/user/PaymentSuccess';
import PaymentFailed from './pages/user/PaymentFailed';

import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollManager from './components/common/ScrollManager';

function App() {
  return (
    <>
    <ScrollManager />
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/category/:slug" element={<CategoryProducts />} />
      <Route path="/product/:slug" element={<ProductDetails />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Auth Pages */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* User Protected Pages */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/addresses" element={<ProtectedRoute><AddressManagement /></ProtectedRoute>} />
      <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/payment-failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
