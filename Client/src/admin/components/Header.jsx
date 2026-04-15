// src/admin/components/Header.jsx
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/userSlice'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState, useRef, useEffect } from 'react'

const Header = () => {
  const { userInfo } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out')
    navigate('/admin/login')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const firstLetter = userInfo?.name?.charAt(0).toUpperCase() || 'A'
  const pageTitle = location.pathname.split('/').pop() || 'dashboard'
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery)
    }
  }

  return (
    <header className="sticky top-0 z-30 shadow-lg" style={{
      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #e67e22 100%)'
    }}>
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left side – Back button + page title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">{formattedTitle}</h1>
            <p className="text-xs text-orange-200">Admin / {formattedTitle.toLowerCase()}</p>
          </div>
        </div>

        {/* Center – Search bar (light background) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 w-80 focus-within:ring-2 focus-within:ring-white/50">
          <svg className="w-4 h-4 text-white/70 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-white placeholder-white/60"
          />
        </form>

        {/* Right side – actions + user */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative p-2 rounded-full hover:bg-white/20 transition">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                {firstLetter}
              </div>
              <span className="hidden lg:inline text-sm font-medium text-white">{userInfo?.name?.split(' ')[0]}</span>
              <svg className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 text-gray-800">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{userInfo?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                </div>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                >
                  <span>📊</span> Dashboard
                </Link>
                <Link
                  to="/admin/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                >
                  <span>👤</span> Profile
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header