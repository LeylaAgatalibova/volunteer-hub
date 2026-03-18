import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVolunteers } from '../../hooks/useVolunteers'
import { deleteVolunteer } from '../../services/volunteers'
import { deleteCV } from '../../services/storage'
import toast from 'react-hot-toast'

function ConfirmModal({ name, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-up">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="font-display font-700 text-ink-800 mb-2">Delete volunteer?</h3>
        <p className="text-sm text-ink-500 font-body mb-6">
          <strong className="text-ink-700">{name}</strong> will be permanently removed along with their CV file.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={loading} className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { volunteers, loading, error, refetch } = useVolunteers()
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, name, storagePath }
  const [deleting, setDeleting] = useState(false)

  const filtered = volunteers.filter((v) =>
    `${v.firstName} ${v.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete() {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await deleteCV(confirmDelete.storagePath)
      await deleteVolunteer(confirmDelete.id)
      toast.success(`${confirmDelete.name} removed`)
      setConfirmDelete(null)
      refetch()
    } catch (err) {
      toast.error('Delete failed: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-800 text-2xl text-ink-800">Volunteer Dashboard</h1>
          <p className="text-sm text-ink-400 font-body mt-0.5">
            {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link to="/admin/volunteer/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Volunteer
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search volunteers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* Table */}
      {loading && (
        <div className="card overflow-hidden">
          <div className="divide-y divide-ink-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-9 h-9 bg-ink-100 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-ink-100 rounded w-40" />
                  <div className="h-3 bg-ink-100 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-display font-600 text-ink-500">
                {search ? 'No volunteers match your search' : 'No volunteers yet'}
              </p>
              {!search && (
                <Link to="/admin/volunteer/new" className="btn-primary mt-4 mx-auto">
                  Add your first volunteer
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50/50">
                    <th className="text-left px-6 py-3 font-display font-600 text-xs text-ink-400 uppercase tracking-widest">Volunteer</th>
                    <th className="text-left px-6 py-3 font-display font-600 text-xs text-ink-400 uppercase tracking-widest hidden md:table-cell">Faculty</th>
                    <th className="text-left px-6 py-3 font-display font-600 text-xs text-ink-400 uppercase tracking-widest hidden lg:table-cell">Role / Skills</th>
                    <th className="text-left px-6 py-3 font-display font-600 text-xs text-ink-400 uppercase tracking-widest">CV</th>
                    <th className="text-right px-6 py-3 font-display font-600 text-xs text-ink-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {filtered.map((v) => {
                    const initials = `${v.firstName?.[0] ?? ''}${v.lastName?.[0] ?? ''}`.toUpperCase()
                    const displaySkills = Array.isArray(v.skills) ? v.skills.slice(0, 2) : []
                    return (
                      <tr key={v.id} className="hover:bg-ink-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-ink-800 text-ink-50 flex items-center justify-center font-display font-700 text-xs flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-display font-600 text-ink-800">{v.firstName} {v.lastName}</p>
                              <p className="text-xs text-ink-400 font-mono">{v.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-ink-500 font-body hidden md:table-cell">
                          {v.faculty || '—'}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          {v.role ? (
                            <span className="badge">{v.role}</span>
                          ) : displaySkills.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {displaySkills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                              {v.skills.length > 2 && <span className="text-xs text-ink-400 font-mono">+{v.skills.length - 2}</span>}
                            </div>
                          ) : <span className="text-ink-300">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {v.cvUrl ? (
                            <a href={v.cvUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-sage-600 hover:text-sage-700 font-mono transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              View CV
                            </a>
                          ) : (
                            <span className="text-xs text-ink-300 font-mono">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/volunteer/edit/${v.id}`}
                              className="text-xs font-display font-600 text-ink-500 hover:text-ink-800 border border-ink-200 hover:border-ink-400 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setConfirmDelete({
                                id: v.id,
                                name: `${v.firstName} ${v.lastName}`,
                                storagePath: v.storagePath,
                              })}
                              className="text-xs font-display font-600 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          name={confirmDelete.name}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
