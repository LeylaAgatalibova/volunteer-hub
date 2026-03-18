import { Outlet, Link, useLocation } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-ink-50/80 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-ink-800 rounded-lg flex items-center justify-center">
              <span className="text-ink-50 font-display font-800 text-sm">V</span>
            </div>
            <div>
              <span className="font-display font-700 text-ink-800 text-sm tracking-wide">VolunteerHub</span>
              <span className="hidden sm:block text-xs text-ink-400 font-body leading-none">Innovation Center</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-display font-500 text-ink-500 hover:text-ink-800 transition-colors"
            >
              Volunteers
            </Link>
            <Link
              to="/admin"
              className="text-sm font-display font-600 text-ink-50 bg-ink-800 px-4 py-1.5 rounded-lg hover:bg-ink-700 transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-display font-600 text-ink-400 text-sm">VolunteerHub</span>
          <span className="text-xs text-ink-300 font-body">University Innovation Center · Student Volunteer Registry</span>
        </div>
      </footer>
    </div>
  )
}
