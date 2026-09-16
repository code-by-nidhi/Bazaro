import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import AddEditProduct from './pages/AddEditProduct';
import CategoryList from './pages/CategoryList';
import OrderList from './pages/OrderList';
import UserList from './pages/UserList';
import CouponList from './pages/CouponList';
import BannerList from './pages/BannerList';
import ReviewList from './pages/ReviewList';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';

import AdminRoute from './components/layout/AdminRoute';

// Every route except /login sits behind AdminRoute.
const protectedRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/products', element: <ProductList /> },
  { path: '/products/add', element: <AddEditProduct /> },
  { path: '/products/edit/:id', element: <AddEditProduct /> },
  { path: '/categories', element: <CategoryList /> },
  { path: '/orders', element: <OrderList /> },
  { path: '/users', element: <UserList /> },
  { path: '/coupons', element: <CouponList /> },
  { path: '/banners', element: <BannerList /> },
  { path: '/reviews', element: <ReviewList /> },
  { path: '/settings', element: <AdminSettings /> },
];

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<AdminRoute>{element}</AdminRoute>} />
      ))}

      {/* Anyone landing on the old /admin/* paths gets folded into this app's root. */}
      <Route path="/admin" element={<Navigate to="/" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
