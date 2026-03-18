import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Public pages
import VolunteerListPage from './pages/public/VolunteerListPage'
import VolunteerDetailPage from './pages/public/VolunteerDetailPage'
import PublicLayout from './components/public/PublicLayout'

// Admin pages
import LoginPage from './pages/admin/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLayout from './components/admin/AdminLayout'
import VolunteerForm from './pages/admin/VolunteerForm'

// Guards
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" />
      <p className="text-sm text-ink-400 font-body">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<VolunteerListPage />} />
        <Route path="/volunteer/:id" element={<VolunteerDetailPage />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="volunteer/new" element={<VolunteerForm />} />
        <Route path="volunteer/edit/:id" element={<VolunteerForm />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
