import { useState, useMemo } from 'react'
import { useVolunteers } from '../../hooks/useVolunteers'
import { filterVolunteers, getUniqueValues } from '../../services/volunteers'
import VolunteerCard from '../../components/public/VolunteerCard'
import FilterBar from '../../components/public/FilterBar'

export default function VolunteerListPage() {
  const { volunteers, loading, error } = useVolunteers()
  const [filters, setFilters] = useState({ search: '', faculty: '', role: '', skill: '' })

  const filtered = useMemo(
    () => filterVolunteers(volunteers, filters),
    [volunteers, filters]
  )

  const options = useMemo(() => ({
    faculties: getUniqueValues(volunteers, 'faculty'),
    roles: getUniqueValues(volunteers, 'role'),
    skills: getUniqueValues(volunteers, 'skills'),
  }), [volunteers])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-10 animate-fade-up">
        <p className="text-xs font-mono font-500 text-ember-500 uppercase tracking-widest mb-3">
          University Innovation Center
        </p>
        <h1 className="font-display font-800 text-4xl sm:text-5xl text-ink-800 leading-tight mb-3">
          Student Volunteers
        </h1>
        <p className="text-ink-400 font-body text-base max-w-xl">
          Meet the talented students powering our innovation programs. Browse by skill, faculty, or role.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 animate-fade-up animation-delay-100">
        <FilterBar filters={filters} onChange={setFilters} options={options} />
      </div>

      {/* Results count */}
      {!loading && (
        <div className="mb-5 flex items-center justify-between animate-fade-up animation-delay-200">
          <p className="text-sm text-ink-400 font-body">
            {filtered.length === volunteers.length
              ? `${volunteers.length} volunteer${volunteers.length !== 1 ? 's' : ''}`
              : `${filtered.length} of ${volunteers.length} volunteers`}
          </p>
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-44 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-11 h-11 bg-ink-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-ink-100 rounded w-3/4" />
                  <div className="h-3 bg-ink-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-ink-100 rounded" />
                <div className="h-3 bg-ink-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-500 font-body text-sm mb-3">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary text-sm">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
          <p className="font-display font-700 text-ink-700 mb-1">No volunteers found</p>
          <p className="text-sm text-ink-400 font-body">Try adjusting your search or filters</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v, i) => (
            <VolunteerCard key={v.id} volunteer={v} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
