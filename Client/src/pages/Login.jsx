// src/pages/Login.jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setCredentials } from '../redux/userSlice'
import authService from '../services/authService'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const user = await authService.login({ email, password })
      dispatch(setCredentials(user))
      toast.success('Logged in')
      navigate(user.isAdmin ? '/admin/dashboard' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={submitHandler}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full border p-2 mb-4 rounded" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full border p-2 mb-4 rounded" 
          required 
        />
        <button 
          type="submit" 
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        New user? <Link to="/register" className="text-orange-600">Register</Link>
      </p>
    </div>
  )
}

export default Login