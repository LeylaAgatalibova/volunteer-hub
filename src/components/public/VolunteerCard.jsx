import { Link } from 'react-router-dom'

function getInitials(first, last) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
}

const FACULTY_COLORS = {
  'Engineering': 'bg-blue-50 text-blue-600 border-blue-100',
  'Science': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Business': 'bg-amber-50 text-amber-600 border-amber-100',
  'Arts': 'bg-purple-50 text-purple-600 border-purple-100',
  'Law': 'bg-red-50 text-red-600 border-red-100',
  'Medicine': 'bg-rose-50 text-rose-600 border-rose-100',
}

function getFacultyColor(faculty) {
  return FACULTY_COLORS[faculty] || 'bg-ink-100 text-ink-500 border-ink-200'
}

export default function VolunteerCard({ volunteer, index = 0 }) {
  const { id, firstName, lastName, faculty, role, skills, bio } = volunteer
  const initials = getInitials(firstName, lastName)
  const displaySkills = Array.isArray(skills) ? skills.slice(0, 3) : []

  return (
    <Link
      to={`/volunteer/${id}`}
      className="card p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-ink-800 text-ink-50 flex items-center justify-center font-display font-700 text-sm flex-shrink-0 group-hover:bg-ember-500 transition-colors duration-200">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-700 text-ink-800 text-base leading-tight truncate group-hover:text-ember-500 transition-colors">
            {firstName} {lastName}
          </h3>
          {faculty && (
            <span className={`inline-block mt-1 text-xs font-display font-600 px-2 py-0.5 rounded-md border ${getFacultyColor(faculty)}`}>
              {faculty}
            </span>
          )}
        </div>
      </div>

      {/* Role or bio */}
      {role ? (
        <p className="text-sm font-body text-ink-500 leading-snug">
          <span className="font-display font-600 text-ink-700">{role}</span>
        </p>
      ) : bio ? (
        <p className="text-sm font-body text-ink-400 leading-snug line-clamp-2">{bio}</p>
      ) : null}

      {/* Skills */}
      {displaySkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {displaySkills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-ink-400 font-mono self-center">+{skills.length - 3}</span>
          )}
        </div>
      )}

      {/* CV indicator */}
      {volunteer.cvUrl && (
        <div className="flex items-center gap-1.5 mt-1">
          <svg className="w-3.5 h-3.5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs text-sage-600 font-mono">CV available</span>
        </div>
      )}
    </Link>
  )
}
