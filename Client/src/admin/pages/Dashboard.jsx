// src/admin/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import API from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await orderService.getAllOrders();
        const products = await productService.getProducts();
        const categoriesRes = await API.get('/categories');
        const categories = categoriesRes.data;
        const couponsRes = await API.get('/coupons/active');
        const activeCoupons = couponsRes.data;

        setTotalOrders(orders.length);
        setTotalProducts(products.length);
        setTotalCategories(categories.length);
        setTotalCoupons(activeCoupons.length);
        const totalRev = orders.reduce((acc, o) => acc + o.totalPrice, 0);
        setRevenue(totalRev);

        // Get 5 most recent products (by createdAt)
        const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentProducts(sortedProducts.slice(0, 5));

        // Get 5 most recent orders (by createdAt)
        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(sortedOrders.slice(0, 5));
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Data for bar chart
  const chartData = [
    { name: 'Orders', value: totalOrders },
    { name: 'Products', value: totalProducts },
    { name: 'Categories', value: totalCategories },
    { name: 'Coupons', value: totalCoupons },
    { name: 'Revenue (₹k)', value: revenue / 1000 },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Orders', value: totalOrders, color: '#f97316' },
    { name: 'Products', value: totalProducts, color: '#e11d48' },
    { name: 'Categories', value: totalCategories, color: '#f59e0b' },
    { name: 'Coupons', value: totalCoupons, color: '#8b5cf6' },
    { name: 'Revenue', value: revenue / 1000, color: '#10b981' },
  ];

  const stats = [
    { title: 'Total Orders', value: totalOrders, icon: '📦', gradient: 'from-orange-500 to-red-500', delay: 0 },
    { title: 'Products', value: totalProducts, icon: '🛍️', gradient: 'from-amber-500 to-orange-500', delay: 0.1 },
    { title: 'Categories', value: totalCategories, icon: '📁', gradient: 'from-rose-500 to-pink-500', delay: 0.2 },
    { title: 'Coupons', value: totalCoupons, icon: '🏷️', gradient: 'from-purple-500 to-indigo-500', delay: 0.25 },
    { title: 'Revenue', value: `₹${revenue.toLocaleString()}`, icon: '💰', gradient: 'from-emerald-500 to-teal-500', delay: 0.3 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            style={{ animationDelay: `${stat.delay}s` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl opacity-80">{stat.icon}</div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-7xl opacity-10 pointer-events-none">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📊 Performance Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#374151' }} />
              <YAxis tick={{ fill: '#374151' }} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (props.payload.name === 'Revenue (₹k)')
                    return [`₹${(value * 1000).toLocaleString()}`, 'Revenue'];
                  return [value, props.payload.name];
                }}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f97316' }}
              />
              <Legend />
              <Bar dataKey="value" fill="url(#brandGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-3 text-center">
            * Revenue is shown in thousands (₹k) for better scale.
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🥧 Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  if (props.payload.name === 'Revenue')
                    return [`₹${(value * 1000).toLocaleString()}`, 'Revenue'];
                  return [value, props.payload.name];
                }}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f97316' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity – Products & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Added Products */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🆕 Recently Added Products
          </h2>
          {recentProducts.length === 0 ? (
            <p className="text-gray-500">No products yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3 border-b pb-2">
                  <img
                    src={product.images?.[0] || product.image || 'https://via.placeholder.com/40'}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      Added on {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-orange-600">₹{product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📦 Recent Orders
          </h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-mono text-sm text-gray-800">#{order._id.slice(-8)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-orange-600">₹{order.totalPrice}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;