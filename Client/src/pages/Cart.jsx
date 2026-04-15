import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchCart,
  updateQtyBackend,
  removeFromCartBackend,
  clearCartBackend,
  localUpdateQty,
  localRemoveFromCart,
  localClearCart,
} from '../redux/cartSlice';
import { applyCoupon, removeCoupon } from '../redux/couponSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector((state) => state.cart);
  const { discount, appliedCoupon, loading: couponLoading } = useSelector((state) => state.coupon);
  const { userInfo } = useSelector((state) => state.user);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    }
  }, [dispatch, userInfo]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal - discount;

  // Optimistic update: change quantity locally first, then sync backend
  const handleUpdateQty = (productId, newQty) => {
    if (newQty < 1) return;
    dispatch(localUpdateQty({ productId, qty: newQty }));
    dispatch(updateQtyBackend({ productId, qty: newQty })).catch(() => {
      dispatch(fetchCart());
      toast.error('Failed to update quantity');
    });
  };

  // Optimistic remove
  const handleRemove = (productId) => {
    dispatch(localRemoveFromCart(productId));
    dispatch(removeFromCartBackend(productId)).catch(() => {
      dispatch(fetchCart());
      toast.error('Failed to remove item');
    });
    toast.success('Item removed from cart');
  };

  // Optimistic clear cart
  const handleClearCart = () => {
    if (window.confirm('Clear entire cart?')) {
      dispatch(localClearCart());
      dispatch(clearCartBackend()).catch(() => {
        dispatch(fetchCart());
        toast.error('Failed to clear cart');
      });
      toast.success('Cart cleared');
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    dispatch(applyCoupon({ code: couponCode, total: subtotal }))
      .unwrap()
      .then(() => toast.success('Coupon applied!'))
      .catch((err) => toast.error(err.message || 'Invalid coupon'));
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't added any khakhras yet.</p>
          <Link to="/products" className="mt-6 inline-block bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-orange-800 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-orange-100 p-4 text-sm font-semibold text-gray-700">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.product} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                    <div className="md:col-span-6 flex gap-4">
                      <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <Link to={`/products/${item.product}`} className="font-semibold text-gray-800 hover:text-orange-600">
                          {item.name}
                        </Link>
                        <button onClick={() => handleRemove(item.product)} className="block text-sm text-red-500 hover:text-red-700 mt-1 flex items-center gap-1">
                          <span>🗑️</span> Remove
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2 text-center font-medium">₹{item.price}</div>
                    <div className="md:col-span-2 flex justify-center">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleUpdateQty(item.product, item.qty - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          ➖
                        </button>
                        <span className="px-4 py-1 border-x min-w-[40px] text-center">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(item.product, item.qty + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2 text-center font-bold text-orange-600">₹{item.price * item.qty}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex justify-between">
                <button onClick={handleClearCart} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                  <span>🧹</span> Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (Coupon: {appliedCoupon})</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>
              </div>

              {/* Coupon Section */}
              {!appliedCoupon ? (
                <div className="mt-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex justify-between items-center bg-green-50 p-2 rounded-lg">
                  <span className="text-green-700">Coupon {appliedCoupon} applied!</span>
                  <button onClick={() => dispatch(removeCoupon())} className="text-red-500 text-sm">
                    Remove
                  </button>
                </div>
              )}

              <Link to="/checkout">
                <button className="w-full mt-6 bg-orange-600 text-white py-3 rounded-full font-semibold hover:bg-orange-700 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;