import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../redux/categorySlice'
import Loader from '../components/Loader'

const Categories = () => {
  const dispatch = useDispatch()
  const { items: categories, loading, error } = useSelector(state => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  if (loading) return <Loader />
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-orange-800">Our Khakhra Categories</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore our wide variety of authentic Gujarati khakhras, each made with love and the finest ingredients.
        </p>

        {categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No categories found. Please check back later.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${getRandomColor(cat.name, 0)}, ${getRandomColor(cat.name, 1)})`
                }}
              >
                <div className="p-6 text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon || '📁'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cat.description || 'Delicious variety'}</p>
                  <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/50 text-orange-700 text-sm font-semibold">
                    Shop Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to generate consistent pastel gradients based on category name
function getRandomColor(name, index) {
  const colors = [
    '#ff9a9e', '#fecfef', '#a1c4fd', '#c2e9fb', '#d4fc79', '#96e6a1',
    '#fbc2eb', '#a6c1ee', '#ffecd2', '#fcb69f', '#e0c3fc', '#8ec5fc'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
  }
  const colorIndex = (Math.abs(hash) + index) % colors.length
  return colors[colorIndex]
}

export default Categories