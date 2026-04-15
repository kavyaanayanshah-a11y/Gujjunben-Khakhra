import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AdminRoute from '../components/AdminRoute'

// User Pages
import Home from '../pages/Home'
import Products from '../pages/Products'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Orders from '../pages/Orders'
import TrackOrder from '../pages/TrackOrder'
import Categories from '../pages/Categories'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Wishlist from '../pages/Wishlist'
import Coupons from '../pages/Coupons';

// Admin
import AdminApp from '../admin/AdminApp'
import Dashboard from '../admin/pages/Dashboard'
import AdminProducts from '../admin/pages/Products'
import AdminOrders from '../admin/pages/Orders'
import AdminCoupons from '../admin/pages/Coupons'
import AdminDelivery from '../admin/pages/Delivery'
import AdminLogin from '../admin/pages/AdminLogin'
import AdminCategories from '../admin/pages/Categories'   // ✅ Added
import ProductDetail from '../pages/ProductDetail'

const UserLayout = () => (
  <>
    <Navbar />
    <div className="min-h-screen">
      <Outlet />
    </div>
    <Footer />
  </>
)

const AppRoutes = () => {
  return (
    <Routes>
      {/* Separate Admin Login - no layout, no protection */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes (require admin) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminApp />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />   {/* ✅ Added */}
          <Route path="orders" element={<AdminOrders />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="delivery" element={<AdminDelivery />} />
        </Route>
      </Route>

      {/* User routes (public + logged‑in users) */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/coupons" element={<Coupons />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div className="text-center p-10"><h1>404 - Page Not Found</h1><a href="/">Go Home</a></div>} />
    </Routes>
  )
}

export default AppRoutes