import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../redux/productSlice'
import { fetchCategories } from '../redux/categorySlice'
import { addToCartBackend } from '../redux/cartSlice'
import { toggleWishlist } from '../redux/wishlistSlice'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Products = () => {
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector(state => state.products)
  const { items: categories } = useSelector(state => state.categories || { items: [] })
  const wishlistItems = useSelector(state => state.wishlist?.items || [])
  const { userInfo } = useSelector(state => state.user)

  // Filter states (unchanged)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedRating, setSelectedRating] = useState(null)
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [availability, setAvailability] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [activeFilters, setActiveFilters] = useState([])
  const [search, setSearch] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const updateActiveFilters = () => {
    const filters = []
    if (selectedCategories.length > 0) filters.push({ type: 'Categories', value: selectedCategories.map(id => categories.find(c => c._id === id)?.name).join(', ') })
    if (priceRange.min > 0 || priceRange.max < 1000) filters.push({ type: 'Price', value: `₹${priceRange.min} - ₹${priceRange.max}` })
    if (selectedRating) filters.push({ type: 'Rating', value: `${selectedRating} Stars & up` })
    if (selectedPromotion) filters.push({ type: 'Promotion', value: selectedPromotion })
    if (availability === 'inStock') filters.push({ type: 'Availability', value: 'In Stock' })
    if (availability === 'outOfStock') filters.push({ type: 'Availability', value: 'Out of Stock' })
    setActiveFilters(filters)
  }

  useEffect(() => {
    updateActiveFilters()
  }, [selectedCategories, priceRange, selectedRating, selectedPromotion, availability, categories])

  const productsArray = Array.isArray(products) ? products : []
  let filtered = productsArray.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category?._id) || selectedCategories.includes(p.category)
    const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max
    const productRating = p.rating || 0
    const matchesRating = !selectedRating || productRating >= selectedRating
    const matchesPromotion = !selectedPromotion || 
      (selectedPromotion === 'Best Sellers' && p.isBestSeller) ||
      (selectedPromotion === 'New Arrivals' && p.isNew) ||
      (selectedPromotion === 'On Sale' && p.discount > 0)
    const matchesAvailability = availability === 'all' ||
      (availability === 'inStock' && p.countInStock > 0) ||
      (availability === 'outOfStock' && p.countInStock === 0)
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesPromotion && matchesAvailability
  })

  if (sortBy === 'price_low') filtered.sort((a,b) => a.price - b.price)
  if (sortBy === 'price_high') filtered.sort((a,b) => b.price - a.price)
  if (sortBy === 'rating') filtered.sort((a,b) => (b.rating || 0) - (a.rating || 0))
  if (sortBy === 'newest') filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))

  const removeFilter = (filter) => {
    if (filter.type === 'Categories') setSelectedCategories([])
    if (filter.type === 'Price') setPriceRange({ min: 0, max: 1000 })
    if (filter.type === 'Rating') setSelectedRating(null)
    if (filter.type === 'Promotion') setSelectedPromotion(null)
    if (filter.type === 'Availability') setAvailability('all')
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: 0, max: 1000 })
    setSelectedRating(null)
    setSelectedPromotion(null)
    setAvailability('all')
    setSortBy('default')
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

  const handleToggleWishlist = (product) => {
    dispatch(toggleWishlist(product))
    toast.success(wishlistItems.some(item => item._id === product._id) ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-white">
      {/* Hero Banner – Lighter Orange/Red Gradient */}
      <div className="relative bg-gradient-to-r from-orange-400 via-red-400 to-orange-300 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
        <div className="container mx-auto text-center text-white relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Our Khakhra Collection</h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto">Crispy, healthy & authentic – explore our wide range of hand‑rolled Gujarati khakhras.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters – Glassmorphism */}
          <aside className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="font-bold text-xl text-orange-800">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-gray-500 hover:text-orange-600">✕</button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-orange-800 border-l-4 border-red-500 pl-3 mb-4 text-lg">By Categories</h3>
                <div className="space-y-2.5">
                  {categories.map(cat => (
                    <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat._id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategories([...selectedCategories, cat._id])
                          else setSelectedCategories(selectedCategories.filter(id => id !== cat._id))
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700 group-hover:text-orange-600 transition">{cat.icon} {cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-orange-800 border-l-4 border-red-500 pl-3 mb-4 text-lg">Price</h3>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-gray-500">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-8">
                <h3 className="font-semibold text-orange-800 border-l-4 border-red-500 pl-3 mb-4 text-lg">Review</h3>
                <div className="space-y-2.5">
                  {[5,4,3,2,1].map(r => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === r}
                        onChange={() => setSelectedRating(r)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{'★'.repeat(r)}{'☆'.repeat(5-r)} {r} Star{r>1?'s':''}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="rating" checked={selectedRating === null} onChange={() => setSelectedRating(null)} />
                    <span className="text-gray-700">All ratings</span>
                  </label>
                </div>
              </div>

              {/* Promotions */}
              <div className="mb-8">
                <h3 className="font-semibold text-orange-800 border-l-4 border-red-500 pl-3 mb-4 text-lg">By Promotions</h3>
                <div className="space-y-2.5">
                  {['New Arrivals', 'Best Sellers', 'On Sale'].map(promo => (
                    <label key={promo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="promotion"
                        checked={selectedPromotion === promo}
                        onChange={() => setSelectedPromotion(promo)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{promo}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="promotion" checked={selectedPromotion === null} onChange={() => setSelectedPromotion(null)} />
                    <span className="text-gray-700">All</span>
                  </label>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h3 className="font-semibold text-orange-800 border-l-4 border-red-500 pl-3 mb-4 text-lg">Availability</h3>
                <div className="space-y-2.5">
                  {['all', 'inStock', 'outOfStock'].map(opt => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === opt}
                        onChange={() => setAvailability(opt)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{opt === 'all' ? 'All' : opt === 'inStock' ? 'In Stock' : 'Out of Stock'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={clearAllFilters} className="mt-2 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition">Clear All Filters</button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Top Bar */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-5 py-2 text-sm flex items-center gap-2 shadow-sm hover:bg-orange-50"
                >
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  Filters
                </button>
                <p className="text-gray-700 text-sm">Showing <span className="font-semibold text-orange-600">{filtered.length}</span> of {productsArray.length} results</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-full px-4 py-1.5 text-sm bg-white focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Active Filters – Chips with gradient */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sm text-gray-600">Active Filters:</span>
                {activeFilters.map((filter, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full px-4 py-1.5 text-sm flex items-center gap-2 shadow-sm">
                    {filter.value}
                    <button onClick={() => removeFilter(filter)} className="ml-1 font-bold hover:text-red-600">✕</button>
                  </div>
                ))}
                <button onClick={clearAllFilters} className="text-sm text-red-600 underline hover:text-red-800">Clear All</button>
              </div>
            )}

            {/* Products Grid – Premium Cards */}
            {loading ? (
              <Loader />
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-orange-100">
                <p className="text-gray-600 text-lg">No khakhras found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(product => {
                  const isInWishlist = wishlistItems.some(item => item._id === product._id)
                  return (
                    <div key={product._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col border border-gray-100">
                      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                        <img
                          src={product.image || 'https://via.placeholder.com/400'}
                          alt={product.name}
                          className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            {product.discount}% OFF
                          </div>
                        )}
                      </Link>
                      <div className="p-5 flex flex-col flex-1">
                        <Link to={`/products/${product._id}`} className="block">
                          <h3 className="font-bold text-xl text-gray-800 hover:text-orange-600 transition line-clamp-1">{product.name}</h3>
                        </Link>
                        <p className="text-orange-600 font-bold text-2xl mt-2">₹{product.price}</p>
                        {product.originalPrice && (
                          <p className="text-gray-400 line-through text-sm">₹{product.originalPrice}</p>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          <div className="flex text-yellow-500 text-sm">
                            {'★'.repeat(Math.floor(product.rating || 0))}{'☆'.repeat(5 - Math.floor(product.rating || 0))}
                          </div>
                          <span className="text-gray-500 text-xs">({product.rating || 0})</span>
                        </div>
                        <div className="mt-auto pt-4 space-y-2">
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                          >
                            {isInWishlist ? '❤️ Added to Wishlist' : '🤍 Add to Wishlist'}
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Features – Orange/Red Gradient */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 mt-16 py-10 text-white">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-12 text-center">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🚚</span>
            <div><p className="font-bold text-lg">Free Shipping</p><p className="text-sm text-orange-100">Free shipping for order above ₹499</p></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">💳</span>
            <div><p className="font-bold text-lg">Flexible Payment</p><p className="text-sm text-orange-100">Multiple secure payment options</p></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">🕒</span>
            <div><p className="font-bold text-lg">24×7 Support</p><p className="text-sm text-orange-100">We support online all days</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products