import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../services/auth'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function AdminLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    try {
      await logout()
      toast.success('Logged out')
      navigate('/admin/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin navbar */}
      <header className="sticky top-0 z-50 bg-ink-900 border-b border-ink-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-ember-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-800 text-xs">V</span>
              </div>
              <span className="font-display font-700 text-ink-50 text-sm">VolunteerHub</span>
            </Link>
            <span className="text-ink-600 text-sm">/</span>
            <span className="text-xs font-mono font-500 text-ember-400 bg-ember-400/10 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-xs text-ink-400 font-mono truncate max-w-[180px]">
                {user.email}
              </span>
            )}
            <Link to="/" className="text-xs text-ink-400 hover:text-ink-200 font-body transition-colors">
              ← Public site
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-display font-600 text-ink-400 hover:text-red-400 transition-colors border border-ink-700 hover:border-red-500/40 px-3 py-1.5 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sub-nav */}
      <div className="bg-ink-800 border-b border-ink-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 h-10 items-center">
          <Link
            to="/admin"
            className={`text-xs font-display font-600 px-3 py-1.5 rounded-md transition-colors ${
              location.pathname === '/admin'
                ? 'bg-ink-700 text-ink-50'
                : 'text-ink-400 hover:text-ink-200 hover:bg-ink-700/50'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/volunteer/new"
            className={`text-xs font-display font-600 px-3 py-1.5 rounded-md transition-colors ${
              location.pathname.includes('/new')
                ? 'bg-ink-700 text-ink-50'
                : 'text-ink-400 hover:text-ink-200 hover:bg-ink-700/50'
            }`}
          >
            + Add Volunteer
          </Link>
        </div>
      </div>

      <main className="flex-1 bg-ink-50">
        <Outlet />
      </main>
    </div>
  )
}
