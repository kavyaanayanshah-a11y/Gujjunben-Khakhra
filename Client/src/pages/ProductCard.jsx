import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import { toggleWishlist } from '../redux/wishlistSlice'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const wishlistItems = useSelector(state => state.wishlist?.items || [])
  const isInWishlist = wishlistItems.some(item => item._id === product._id)

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }))
    toast.success(`${product.name} added to cart`)
  }

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product))
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={product.image || 'https://via.placeholder.com/300'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-orange-600 font-bold text-xl mt-1">₹{product.price}</p>

        {/* ✅ WISHLIST BUTTON (ABOVE ADD TO CART) */}
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
  )
}

export default ProductCard