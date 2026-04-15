import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { clearCartBackend } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartBackend());
    toast.success('Logged out');
    navigate('/login');
  };

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <nav className="w-full sticky top-0 z-50">
      {/* Top Promo Strip – light orange */}
      <div className="bg-orange-100 text-orange-700 text-center text-xs font-semibold py-2 tracking-wide">
        🎁 Free shipping on orders above ₹499 &nbsp;|&nbsp; Pan India Delivery
      </div>

      {/* Main Navigation – Light & Airy with light orange accents */}
      <div className="bg-white/90 backdrop-blur-sm shadow-md border-b border-orange-100">
        <div className="container mx-auto px-6 flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-sm group-hover:bg-orange-200 transition">
              🫓
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-wide text-stone-700 drop-shadow-sm">
                GUJJUBEN KHAKHRA
              </span>
              <span className="text-xs text-stone-500">ગુજ્જુબેન ખાખરા</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {[
              { to: '/products', label: 'Products' },
              { to: '/categories', label: 'Categories' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/coupons', label: 'Offers' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 text-stone-600"
              >
                {label}
              </Link>
            ))}

            <div className="w-px h-5 mx-1 bg-stone-200" />

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-1.5 rounded-full text-xl transition hover:scale-110 text-stone-500 hover:text-orange-500"
            >
              ❤️
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative p-1.5 rounded-full text-xl transition hover:scale-110 text-stone-500 hover:text-orange-500">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-400 text-stone-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <>
                <Link
                  to="/orders"
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition hover:bg-orange-50 hover:text-orange-600 text-stone-600"
                >
                  My Orders
                </Link>
                <Link
                  to="/track"
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition hover:bg-orange-50 hover:text-orange-600 text-stone-600"
                >
                  Track
                </Link>
                {userInfo.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-1 rounded-full text-xs font-bold border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 transition"
                  >
                    Admin
                  </Link>
                )}
                <div className="w-px h-5 mx-1 bg-stone-200" />
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="w-px h-5 mx-1 bg-stone-200" />
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm font-semibold border border-stone-300 text-stone-600 hover:bg-stone-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-full text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Accent Line – soft glow */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
    </nav>
  );
};

export default Navbar;