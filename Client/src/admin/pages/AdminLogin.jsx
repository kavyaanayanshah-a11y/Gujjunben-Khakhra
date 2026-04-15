import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setCredentials } from '../../redux/userSlice'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const user = await authService.login({ email, password })
      if (!user.isAdmin) {
        toast.error('Access denied. Admin only.')
        return
      }
      dispatch(setCredentials(user))
      toast.success('Admin logged in')
      navigate('/admin/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      if (msg.includes('Invalid email')) {
        toast.error('No account found. Register first and set isAdmin=true in MongoDB.', { duration: 5000 })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👑</div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-600 text-sm">Access the admin panel</p>
        </div>

        {/* Helpful message for first-time admins */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          💡 <strong>No admin yet?</strong> Register as a normal user, then in MongoDB Compass set <code>isAdmin: true</code>.
        </div>

        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Admin Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm space-y-2">
          <Link to="/login" className="text-orange-600 block">← User Login</Link>
          <Link to="/register" className="text-gray-500 block text-xs">Register new account</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin