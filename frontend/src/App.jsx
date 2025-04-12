import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth } from "./store/authSlice";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnnouncementPage from "./pages/AnnouncementPage";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";

// Admin components
import AdminLayout from "./Admin/AdminLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import UserManagement from "./Admin/UserManagement";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduct from "./pages/AddProduct";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import MyProducts from "./pages/MyProducts";
import ChatPage from "./pages/ChatPage";
import ChatListPage from "./pages/hatListPage";
import AdminProductManagement from "./Admin/AdminProductManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />

            {/* Protected User Routes */}
            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/products/:id" element={<SingleProduct />} />
              {/* <Route path="/products/edit/:id" element={<ProductForm />} /> */}
              <Route path="/addProduct" element={<AddProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<MyProducts />} />
              <Route path="/inbox" element={<ChatListPage />} />
              <Route path="/Announcement" element={<AnnouncementPage />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
            {/* </Route> */}

            {/* Admin Protected Routes */}
            {/* <Route element={<ProtectedRoute adminOnly={true} />}> */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<AdminProductManagement />} />
              {/* </Route> */}
            </Route>

            {/* Redirect for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;
