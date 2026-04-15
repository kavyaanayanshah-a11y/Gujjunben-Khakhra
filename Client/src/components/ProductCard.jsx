import { useDispatch, useSelector } from 'react-redux'
import { addToCartBackend } from '../redux/cartSlice'   // ✅ changed from addToCart
import { toggleWishlist } from '../redux/wishlistSlice'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [showQuickView, setShowQuickView] = useState(false)

  const wishlistItems = useSelector(state => state.wishlist?.items || [])
  const { userInfo } = useSelector(state => state.user)   // to check login
  const isInWishlist = wishlistItems.some(item => item._id === product._id)

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.error('Please login to add items to cart')
      return
    }
    dispatch(addToCartBackend({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
      countInStock: product.countInStock
    }))
    toast.success(`${product.name} added to cart`)
  }

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product))
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  // Rating stars (optional)
  const renderStars = (rating) => {
    if (!rating) return null
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    const empty = 5 - full - (half ? 1 : 0)
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(full)].map((_, i) => <span key={i} className="text-yellow-500">★</span>)}
        {half && <span className="text-yellow-500">½</span>}
        {[...Array(empty)].map((_, i) => <span key={i} className="text-gray-300">★</span>)}
      </div>
    )
  }

  return (
    <>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1.5 shadow-sm hover:scale-110 transition"
        >
          <svg className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-none'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
            {product.discount}% OFF
          </div>
        )}

        {/* Product Image */}
        <Link to={`/products/${product._id}`}>
          <div className="relative overflow-hidden h-56 bg-gray-100">
            <img
              src={product.image || 'https://via.placeholder.com/300x250?text=Khakhra'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
                className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-50"
              >
                Quick View
              </button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          {product.categoryName && <p className="text-xs text-gray-500 uppercase tracking-wide">{product.categoryName}</p>}
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="font-bold text-gray-800 line-clamp-1 mt-1 hover:text-orange-600">{product.name}</h3>
          </Link>
          {product.rating && (
            <div className="flex items-center gap-2 mt-1">
              {renderStars(product.rating)}
              <span className="text-xs text-gray-500">{product.rating}</span>
            </div>
          )}
          <div className="mt-2">
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-orange-600 font-bold text-xl">₹{product.price}</span>
                <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
              </div>
            ) : (
              <span className="text-orange-600 font-bold text-xl">₹{product.price}</span>
            )}
          </div>

          {/* Buttons */}
          <button
            onClick={handleToggleWishlist}
            className="mt-3 w-full bg-gray-100 text-gray-700 py-2 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            {isInWishlist ? '❤️ Added to Wishlist' : '🤍 Add to Wishlist'}
          </button>

          <button
            onClick={handleAddToCart}
            className="mt-2 w-full bg-orange-600 text-white py-2 rounded-full font-semibold hover:bg-orange-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowQuickView(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row">
              <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} className="md:w-1/2 w-full h-64 object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
              <div className="p-6 md:w-1/2">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <button onClick={handleToggleWishlist} className="text-2xl">{isInWishlist ? '❤️' : '🤍'}</button>
                </div>
                {product.rating && (
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(product.rating)}
                    <span className="text-gray-500 text-sm">({product.rating})</span>
                  </div>
                )}
                <p className="text-orange-600 text-2xl font-bold mt-2">₹{product.price}</p>
                {product.originalPrice && <p className="text-gray-400 line-through">₹{product.originalPrice}</p>}
                <p className="text-gray-600 mt-4">{product.description || 'Authentic Gujarati khakhra made with pure ingredients.'}</p>
                <button onClick={() => { handleAddToCart(); setShowQuickView(false); }} className="mt-6 w-full bg-orange-600 text-white py-2 rounded-full font-semibold hover:bg-orange-700">Add to Cart</button>
                <button onClick={() => setShowQuickView(false)} className="mt-3 w-full border border-gray-300 py-2 rounded-full font-medium hover:bg-gray-100">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard