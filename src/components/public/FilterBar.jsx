export default function FilterBar({ filters, onChange, options }) {
  const { faculties, roles, skills } = options

  function handleChange(key, value) {
    onChange({ ...filters, [key]: value })
  }

  function clearAll() {
    onChange({ search: '', faculty: '', role: '', skill: '' })
  }

  const hasActiveFilters = filters.faculty || filters.role || filters.skill

  return (
    <div className="card p-4 flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name…"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* Dropdowns row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="label">Faculty</label>
          <select
            value={filters.faculty}
            onChange={(e) => handleChange('faculty', e.target.value)}
            className="input text-sm appearance-none cursor-pointer"
          >
            <option value="">All Faculties</option>
            {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Role</label>
          <select
            value={filters.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="input text-sm appearance-none cursor-pointer"
          >
            <option value="">All Roles</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Skill</label>
          <select
            value={filters.skill}
            onChange={(e) => handleChange('skill', e.target.value)}
            className="input text-sm appearance-none cursor-pointer"
          >
            <option value="">All Skills</option>
            {skills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="self-start text-xs font-display font-600 text-ember-500 hover:text-ember-600 flex items-center gap-1 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  )
}
