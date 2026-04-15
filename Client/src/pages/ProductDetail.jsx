import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../redux/productSlice'
import { addToCartBackend } from '../redux/cartSlice'
import { toggleWishlist } from '../redux/wishlistSlice'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  const { currentProduct: product, loading } = useSelector(state => state.products)
  const wishlistItems = useSelector(state => state.wishlist?.items || [])
  const { userInfo } = useSelector(state => state.user)
  const isInWishlist = product ? wishlistItems.some(item => item._id === product._id) : false

  useEffect(() => {
    if (id) dispatch(fetchProductById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (id) {
      setLoadingReviews(true)
      fetch(`/api/reviews/product/${id}`)
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingReviews(false))
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error('Please login to add items to cart')
      return
    }
    if (product) {
      try {
        await dispatch(addToCartBackend({
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          qty: quantity,
          countInStock: product.countInStock
        })).unwrap()
        toast.success(`${product.name} added to cart`)
      } catch (err) {
        toast.error(err || 'Failed to add to cart')
      }
    }
  }

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(toggleWishlist(product))
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!userInfo) {
      toast.error('Please login to write a review')
      navigate('/login')
      return
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ productId: id, rating, comment: reviewText })
      })
      if (res.ok) {
        const newReview = await res.json()
        setReviews([newReview, ...reviews])
        setReviewText('')
        setRating(5)
        toast.success('Review added')
      } else if (res.status === 401) {
        toast.error('Session expired. Please login again.')
        navigate('/login')
      } else {
        toast.error('Failed to add review')
      }
    } catch (err) {
      toast.error('Error submitting review')
    }
  }

  const renderStars = (ratingValue) => {
    const full = Math.floor(ratingValue)
    const empty = 5 - full
    return (
      <div className="flex gap-0.5 text-yellow-500">
        {[...Array(full)].map((_, i) => <span key={i}>★</span>)}
        {[...Array(empty)].map((_, i) => <span key={i} className="text-gray-300">★</span>)}
      </div>
    )
  }

  if (loading) return <Loader />
  if (!product) return <div className="text-center py-20">Product not found</div>

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  // Prepare image list (up to 4 images)
  const productImages = product.images?.length ? product.images : (product.image ? [product.image] : [])
  const displayImages = [...productImages]
  while (displayImages.length < 4) displayImages.push('https://via.placeholder.com/300?text=No+Image')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-white">
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-red-600 transition font-medium"
        >
          ← Back to Products
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          <div className="flex flex-col md:flex-row">
            {/* Image Section – 2x2 Grid */}
            <div className="md:w-1/2 bg-gradient-to-br from-orange-100 to-red-100 p-6">
              <div className="grid grid-cols-2 gap-2">
                {displayImages.map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-xl shadow-md">
                    <img
                      src={img}
                      alt={`${product.name} ${idx+1}`}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-4xl font-extrabold text-gray-800">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {renderStars(avgRating)}
                  <span className="text-gray-600 ml-2">{avgRating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{reviews.length} reviews</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-orange-600">₹{product.price}</p>
                {product.originalPrice && <p className="text-gray-400 line-through text-sm mt-1">₹{product.originalPrice}</p>}
              </div>
              <p className="text-gray-700 mt-4 leading-relaxed">{product.description || 'Authentic Gujarati khakhra made with pure ingredients.'}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Stock:</span>
                <span className={`text-sm font-semibold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of stock'}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition">-</button>
                  <span className="px-6 py-2 text-center min-w-[60px]">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition">+</button>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button onClick={handleAddToCart} disabled={product.countInStock === 0} className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-full font-bold text-lg shadow-md hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed">Add to Cart</button>
                <button onClick={handleToggleWishlist} className="w-full bg-gray-100 text-gray-800 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                  {isInWishlist ? '❤️ Added to Wishlist' : '🤍 Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section (unchanged) */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-red-500 pl-4">Customer Reviews</h2>

          {userInfo ? (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl mb-8">
              <h3 className="font-semibold text-lg text-orange-800 mb-3">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Rating:</span>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border border-gray-300 rounded-full px-3 py-1 focus:ring-orange-500">
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
                  </select>
                </div>
                <textarea rows="3" placeholder="Share your experience with this khakhra..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-semibold transition">Submit Review</button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl text-center mb-8">
              <p className="text-gray-600">Login to write a review.</p>
              <Link to="/login" className="text-orange-600 underline font-medium">Login here</Link>
            </div>
          )}

          {loadingReviews ? (
            <Loader />
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review._id} className="border-b border-gray-200 pb-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium text-gray-700">{review.rating}</span>
                    <span className="text-sm text-gray-500">• {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">— {review.user?.name || 'Anonymous'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail