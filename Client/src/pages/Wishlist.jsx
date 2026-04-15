import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromWishlist } from '../redux/wishlistSlice'
import { addToCartBackend } from '../redux/cartSlice'   // ✅ changed
import toast from 'react-hot-toast'

const Wishlist = () => {
  const { items } = useSelector(state => state.wishlist)
  const { userInfo } = useSelector(state => state.user)   // for login check
  const dispatch = useDispatch()

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id))
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = async (product) => {
    if (!userInfo) {
      toast.error('Please login to add items to cart')
      return
    }
    try {
      await dispatch(addToCartBackend({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
        countInStock: product.countInStock
      })).unwrap()
      toast.success(`${product.name} added to cart`)
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
          <Link to="/products" className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-full">Shop Now</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-orange-800">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(product => (
            <div key={product._id} className="bg-white rounded-xl shadow-md p-4 relative">
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
              <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="font-bold mt-2">{product.name}</h3>
              <p className="text-orange-600 font-semibold">₹{product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 w-full bg-orange-600 text-white py-1 rounded-full text-sm hover:bg-orange-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist