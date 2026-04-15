import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import khakhraImage from '../assets/images/Khakhra.jpg'; // Adjust path if needed

const Home = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productsArray = Array.isArray(items) ? items : [];
  const bestSellers = productsArray.slice(0, 4);

  return (
    <div className="bg-white">
      {/* ========== LIGHT & FRESH HERO SECTION ========== */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50/30 py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-block border border-amber-300 bg-amber-100/80 text-amber-700 text-sm font-medium px-5 py-1.5 rounded-full mb-3 shadow-sm">
              ✦ Traditional Gujarati Delight ✦
            </span>
            <h2
              className="text-5xl font-extrabold text-amber-600"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Happy Tummy
            </h2>
            <h3 className="text-3xl font-bold tracking-widest text-stone-600 mt-1">
              GUJRATI KHAKHRA
            </h3>
          </div>
          <p className="text-center text-stone-500 max-w-xl mx-auto mb-10 text-base leading-relaxed">
            Khakhra is a traditional dish from India. It is a thin, crunchy flatbread from Gujarat's
            buzzing state. Its unique spicy taste results from toasting whole wheat flour over a high heat source.
          </p>

          {/* Arena */}
          <div
            className="relative mx-auto"
            style={{ width: '100%', maxWidth: '700px', height: '520px' }}
          >
            {/* Speech Bubble - Light Coral */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-4 z-10 text-center bg-amber-400 text-white px-7 py-3 rounded-[50%] after:content-[''] after:absolute after:bottom-[-14px] after:left-1/2 after:-translate-x-1/2 after:border-[14px] after:border-transparent after:border-t-amber-400 shadow-md"
              style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', minWidth: '150px' }}
            >
              <div className="font-extrabold text-xl tracking-wide leading-tight">
                GUJRATI<br />KHAKHRA
              </div>
              <div className="text-xs opacity-90">by Happy Tummy</div>
            </div>

            {/* SVG Curved Arrows - Softer stroke */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 700 520"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#a16207" />
                </marker>
              </defs>
              <path
                d="M 180,200 Q 240,230 280,255"
                stroke="#b45309"
                strokeWidth="1.8"
                fill="none"
                markerEnd="url(#arr)"
                opacity="0.7"
              />
              <path
                d="M 520,200 Q 460,230 420,255"
                stroke="#b45309"
                strokeWidth="1.8"
                fill="none"
                markerEnd="url(#arr)"
                opacity="0.7"
              />
              <path
                d="M 175,360 Q 240,340 285,330"
                stroke="#b45309"
                strokeWidth="1.8"
                fill="none"
                markerEnd="url(#arr)"
                opacity="0.7"
              />
              <path
                d="M 525,360 Q 460,340 415,330"
                stroke="#b45309"
                strokeWidth="1.8"
                fill="none"
                markerEnd="url(#arr)"
                opacity="0.7"
              />
              <path
                d="M 350,445 Q 350,420 350,395"
                stroke="#b45309"
                strokeWidth="1.8"
                fill="none"
                markerEnd="url(#arr)"
                opacity="0.7"
              />
            </svg>

            {/* Center Khakhra Image with soft border */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-full overflow-hidden border-[6px] border-white shadow-xl"
              style={{ width: '260px', height: '260px' }}
            >
              <img src={khakhraImage} alt="Khakhra stack" className="w-full h-full object-cover" />
            </div>

            {/* Description box - Lighter glassmorphic style */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-30 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl px-4 py-2 text-xs text-stone-600 text-center leading-snug font-medium shadow-sm"
              style={{ top: '57%', maxWidth: '195px' }}
            >
              Khakhra is a traditional dish from India. It is a thin, crunchy flatbread from Gujarat's
              buzzing state. Its unique spicy taste results from toasting whole wheat flour over a high
              heat source.
            </div>

            {/* Benefit Labels - Soft pastel colors */}
            <div
              className="absolute font-bold text-sm text-amber-700 text-right leading-snug drop-shadow-sm"
              style={{ top: '130px', left: '10px' }}
            >
              Nutrient-Rich<br />Khakhra
            </div>
            <div
              className="absolute font-bold text-sm text-amber-700 text-left leading-snug drop-shadow-sm"
              style={{ top: '130px', right: '10px' }}
            >
              Digestive Friendly<br />Khakhra
            </div>
            <div
              className="absolute font-bold text-sm text-amber-700 text-right leading-snug drop-shadow-sm"
              style={{ bottom: '80px', left: '20px' }}
            >
              High Protein<br />Khakhra
            </div>
            <div
              className="absolute font-bold text-sm text-amber-700 text-left leading-snug drop-shadow-sm"
              style={{ bottom: '80px', right: '20px' }}
            >
              Gluten-Free<br />Khakhra
            </div>
            <div
              className="absolute font-bold text-sm text-amber-700 text-center leading-snug left-1/2 -translate-x-1/2 drop-shadow-sm"
              style={{ bottom: '20px' }}
            >
              Steady Energy<br />Release Khakhra
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers Section - Light pastel gradient */}
      <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-amber-700">
            Our Best Sellers
          </h2>
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/products">
                  <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold transition shadow-md">
                    View All Products →
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Customer Love Section - Soft white card feeling */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-700">Customer Love</h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Customer satisfaction is our top priority. We strive to exceed your expectations with every
          product we create.
        </p>
        <div className="mt-6 flex justify-center gap-1 text-amber-400 text-3xl">★★★★★</div>
        <p className="mt-4 text-stone-500 italic">"Best khakhras I've ever had!" – Priya M.</p>
      </div>

      {/* Premium Brand Section - Soft cream background */}
      <div className="bg-amber-50/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3815/3815283.png"
            alt="Stemsp"
            className="h-16 mx-auto mb-4 opacity-80"
          />
          <h3 className="text-2xl font-semibold mb-2 text-amber-700">Stemsp</h3>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Premium brand of spices, herbs, and natural extracts. Made with the finest ingredients to
            enhance your dishes.
          </p>
        </div>
      </div>

      {/* Track Order & Contact - Light cards with subtle border */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-amber-100">
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-amber-100">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png"
            alt="Track"
            className="h-12 mx-auto mb-3 opacity-80"
          />
          <h3 className="text-xl font-bold mb-2 text-stone-700">Track Your Order</h3>
          <p className="text-stone-500">Track your order history in real-time.</p>
          <Link to="/track" className="text-amber-600 underline mt-2 inline-block font-medium">
            Go to Tracking →
          </Link>
        </div>
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-amber-100">
          <img
            src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
            alt="Contact"
            className="h-12 mx-auto mb-3 opacity-80"
          />
          <h3 className="text-xl font-bold mb-2 text-stone-700">Contact Us</h3>
          <p className="text-stone-500">For any questions or inquiries, please contact us at</p>
          <a href="mailto:contact@gujjubenkhakhra.com" className="text-amber-600 font-medium">
            contact@gujjubenkhakhra.com
          </a>
        </div>
      </div>

      {/* Social Media Follow */}
      <div className="py-8 text-center">
        <p className="text-stone-500 mb-3">
          Follow us on social media to stay updated with the latest news and offers.
        </p>
        <div className="flex justify-center gap-6 text-3xl text-stone-500">
          <a href="#" className="hover:text-amber-500 transition">
            📘
          </a>
          <a href="#" className="hover:text-amber-500 transition">
            📸
          </a>
          <a href="#" className="hover:text-amber-500 transition">
            🐦
          </a>
          <a href="#" className="hover:text-amber-500 transition">
            📌
          </a>
        </div>
      </div>

      {/* Why Choose Gujjuben Section - Light cards with pastel backgrounds */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-amber-700">
          Why Choose Gujjuben?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center p-4 bg-amber-50/40 rounded-2xl shadow-sm hover:shadow-md transition border border-amber-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="Pure Ingredients"
              className="h-16 mx-auto mb-4 opacity-80"
            />
            <h3 className="text-xl font-semibold mb-2 text-stone-700">Pure Ingredients</h3>
            <p className="text-stone-500">
              Rich in essential oils and antioxidants, known for health benefits.
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50/40 rounded-2xl shadow-sm hover:shadow-md transition border border-amber-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2909/2909590.png"
              alt="Healthy Snacks"
              className="h-16 mx-auto mb-4 opacity-80"
            />
            <h3 className="text-xl font-semibold mb-2 text-stone-700">Healthy Snacks</h3>
            <p className="text-stone-500">
              Perfect for on-the-go snacking, made with high-quality ingredients.
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50/40 rounded-2xl shadow-sm hover:shadow-md transition border border-amber-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/814/814513.png"
              alt="Worldwide Reach"
              className="h-16 mx-auto mb-4 opacity-80"
            />
            <h3 className="text-xl font-semibold mb-2 text-stone-700">Worldwide Reach</h3>
            <p className="text-stone-500">Available in over 100 countries worldwide.</p>
          </div>
          <div className="text-center p-4 bg-amber-50/40 rounded-2xl shadow-sm hover:shadow-md transition border border-amber-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2883/2883748.png"
              alt="World-class Quality"
              className="h-16 mx-auto mb-4 opacity-80"
            />
            <h3 className="text-xl font-semibold mb-2 text-stone-700">World-class Quality</h3>
            <p className="text-stone-500">
              We use only the finest ingredients to ensure the highest quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;