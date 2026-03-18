import { Outlet, Link } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">

    
{/* Logo banner */}
<div className="bg-ink-50 border-b border-ink-100 ">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-center">
    <img
      src="/logo.png"
      alt="ATU İnnovasiya Mərkəzi"
      className="h-20 sm:h-44 object-contain mix-blend-multiply"
    />
  </div>
</div>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink-50/80 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-display font-700 text-ink-800 text-sm tracking-wide hover:text-ember-500 transition-colors">
            Könüllü Tələbələr
          </Link>
          <Link
            to="/admin"
            className="text-sm font-display font-semibold text-ink-50 bg-ink-800 px-4 py-1.5 rounded-lg hover:bg-ink-700 transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

   <footer className="border-t border-ink-100 py-6 mt-16">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
    <img src="/logo.png" alt="ATU" className="h-16 object-contain opacity-98 mix-blend-multiply" />
    <span className="text-xs text-ink-300 font-body">
      Azərbaycan Texnologiya Universiteti · İnnovasiya Mərkəzi
    </span>
  </div>
</footer>

    </div>
  )
}