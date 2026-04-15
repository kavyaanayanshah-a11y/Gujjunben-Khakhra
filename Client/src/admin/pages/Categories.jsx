import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../redux/categorySlice'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(state => state.categories || { items: [], loading: false })
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '', description: '' })
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Category name is required')
      return
    }
    try {
      if (editing) {
        await dispatch(updateCategory({ id: editing._id, categoryData: form })).unwrap()
        toast.success('Category updated')
      } else {
        await dispatch(createCategory(form)).unwrap()
        toast.success('Category created')
      }
      setEditing(null)
      setForm({ name: '', icon: '', description: '' })
      setShowModal(false)
      dispatch(fetchCategories()) // refresh list
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap()
        toast.success('Category deleted')
        dispatch(fetchCategories())
      } catch (err) {
        toast.error('Delete failed')
      }
    }
  }

  const openEditModal = (category) => {
    setEditing(category)
    setForm({
      name: category.name,
      icon: category.icon || '📁',
      description: category.description || ''
    })
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditing(null)
    setForm({ name: '', icon: '', description: '' })
    setShowModal(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg shadow-md transition flex items-center gap-2"
        >
          ➕ Add Category
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(cat => (
            <div key={cat._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{cat.icon || '📁'}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{cat.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{cat.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No categories yet. Click "Add Category" to create one.
            </div>
          )}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Category' : 'Create Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category Name (e.g., Masala Khakhra)"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                placeholder="Icon (emoji, e.g., 🌶️)"
                value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
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

export default AdminCategories