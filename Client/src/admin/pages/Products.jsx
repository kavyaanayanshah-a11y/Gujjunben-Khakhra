// src/admin/pages/AdminProducts.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/productSlice'
import { fetchCategories } from '../../redux/categorySlice'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const dispatch = useDispatch()
  const { items: products, loading: productsLoading } = useSelector(state => state.products)
  const { items: categories, loading: categoriesLoading } = useSelector(state => state.categories || { items: [] })

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
    countInStock: 0,
    category: ''
  })

  const [showModal, setShowModal] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  // ✅ Handle multiple image upload (max 4)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4)
    if (files.length === 0) return
    setUploadingImages(true)

    const readers = []
    const newPreviews = []

    files.forEach((file, idx) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews[idx] = reader.result
        if (newPreviews.filter(p => p).length === files.length) {
          const combined = [...imagePreviews, ...newPreviews].slice(0, 4)
          setImagePreviews(combined)
          setForm({ ...form, images: combined })
          setUploadingImages(false)
        }
      }
      reader.readAsDataURL(file)
      readers.push(reader)
    })
  }

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews]
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)
    setForm({ ...form, images: newPreviews })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price required')
      return
    }
    try {
      if (editing) {
        await dispatch(updateProduct({ id: editing._id, productData: form })).unwrap()
        toast.success('Product updated')
      } else {
        await dispatch(createProduct(form)).unwrap()
        toast.success('Product created')
      }
      setEditing(null)
      setForm({
        name: '',
        price: '',
        description: '',
        images: [],
        countInStock: 0,
        category: ''
      })
      setImagePreviews([])
      setShowModal(false)
      dispatch(fetchProducts())
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap()
        toast.success('Product deleted')
        dispatch(fetchProducts())
      } catch (err) {
        toast.error('Delete failed')
      }
    }
  }

  const openEditModal = (product) => {
    setEditing(product)
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      images: product.images || [],
      countInStock: product.countInStock || 0,
      category: product.category || ''
    })
    setImagePreviews(product.images || [])
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditing(null)
    setForm({
      name: '',
      price: '',
      description: '',
      images: [],
      countInStock: 0,
      category: ''
    })
    setImagePreviews([])
    setShowModal(true)
  }

  const getCategoryName = (id) => {
    const cat = categories.find(c => c._id === id)
    return cat ? cat.name : 'Uncategorized'
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          ➕ Add Product
        </button>
      </div>

      {productsLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const displayImages = product.images?.length ? product.images.slice(0, 4) : []
            // Pad with placeholders if less than 4
            while (displayImages.length < 4) displayImages.push('https://via.placeholder.com/80')
            return (
              <div key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border border-gray-100">
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {displayImages.slice(0,4).map((img, idx) => (
                    <img key={idx} src={img} alt={`${product.name} ${idx+1}`} className="w-full h-20 object-cover rounded-lg" />
                  ))}
                </div>
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <p className="text-orange-600 font-semibold mt-1">₹{product.price}</p>
                <p className="text-sm text-gray-500 mt-1">Stock: {product.countInStock}</p>
                <p className="text-xs text-gray-400 mt-1">Category: {getCategoryName(product.category)}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800 text-sm">✏️ Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
                </div>
              </div>
            )
          })}
          {products.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">No products yet. Click "Add Product" to create one.</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'Create Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Count"
                  value={form.countInStock}
                  onChange={e => setForm({ ...form, countInStock: e.target.value })}
                  className="border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                  {categoriesLoading && <p className="text-xs text-gray-400 mt-1">Loading categories...</p>}
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (up to 4)</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative">
                        <img src={preview} alt={`Preview ${idx+1}`} className="w-20 h-20 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 4 && (
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition flex items-center gap-2">
                        📁 Choose Files (max 4)
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                  {uploadingImages && <span className="text-sm text-gray-500">Uploading...</span>}
                  <p className="text-xs text-gray-400">You can select up to 4 images. First image will be used as main.</p>
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                rows="4"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts