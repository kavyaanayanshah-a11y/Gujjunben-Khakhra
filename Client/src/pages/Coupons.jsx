// src/pages/Coupons.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await API.get('/coupons/active');
        setCoupons(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load coupons');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Simple Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Coupons & Offers</h1>
          <p className="text-gray-500">Copy the code and use it at checkout</p>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No active coupons at the moment. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition"
              >
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  ₹{coupon.discount} OFF
                </div>
                <div className="text-xl font-mono bg-gray-100 px-4 py-2 rounded-md inline-block mb-4">
                  {coupon.code}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  Min. order: ₹{coupon.minOrder}
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  Valid till: {new Date(coupon.expiryDate).toLocaleDateString()}
                </div>
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-md font-medium hover:from-orange-600 hover:to-red-600 transition shadow-sm"
                >
                  Copy Code
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;