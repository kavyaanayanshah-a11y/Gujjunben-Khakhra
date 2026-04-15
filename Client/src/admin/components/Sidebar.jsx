// src/admin/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Sidebar = () => {
  const { userInfo } = useSelector(state => state.user)
  const userName = userInfo?.name || 'Admin'
  const greeting = `Good Day ${userName.split(' ')[0]}`

  const menuLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/products', label: 'Products', icon: '🛍️' },
    { to: '/admin/categories', label: 'Categories', icon: '📁' },
    { to: '/admin/orders', label: 'Orders', icon: '📦' },
    { to: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
    { to: '/admin/delivery', label: 'Delivery', icon: '🚚' },
  ]

  const serviceLinks = [
    { to: '/admin/jira', label: 'Jira software', icon: '🔧' },
    { to: '/admin/slack', label: 'Slack', icon: '💬' },
    { to: '/admin/intercom', label: 'Intercom', icon: '🔄' },
  ]

  return (
    <aside className="w-72 flex flex-col h-full shadow-2xl" style={{
      background: 'linear-gradient(180deg, #1e1e2f 0%, #2a2a3b 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* User Greeting & Avatar */}
      <div className="p-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-gray-400">Good Day</p>
            <p className="font-semibold text-white">{userName.split(' ')[0]}</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">Menu 6</div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Menu</div>
          <div className="space-y-1">
            {menuLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 font-medium shadow-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Service</div>
          <div className="space-y-1">
            {serviceLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 font-medium'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.label}</span>
              </NavLink>
            ))}
            <NavLink
              to="/admin/plugins"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <span className="text-lg">➕</span>
              <span className="text-sm">Add new plugin</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Footer – Create new task */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-md">
          ✨ Create new task
        </button>
      </div>
    </aside>
  )
}

export default Sidebar