import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVolunteerById } from '../../services/volunteers'

export default function VolunteerDetailPage() {
  const { id } = useParams()
  const [volunteer, setVolunteer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getVolunteerById(id)
        setVolunteer(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
      <div className="w-8 h-8 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <Link to="/" className="btn-secondary">← Back to volunteers</Link>
    </div>
  )

  if (!volunteer) return null

  const { firstName, lastName, faculty, studentId, role, skills, bio, cvUrl, cvFileName } = volunteer
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
  const displaySkills = Array.isArray(skills) ? skills : []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-700 font-body transition-colors mb-8 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        All volunteers
      </Link>

      <div className="card p-8 animate-fade-up">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-ink-100">
          <div className="w-20 h-20 rounded-2xl bg-ink-800 text-ink-50 flex items-center justify-center font-display font-800 text-2xl flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-800 text-3xl text-ink-800 mb-2">
              {firstName} {lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {faculty && (
                <span className="text-sm font-display font-600 text-ink-500 bg-ink-100 px-3 py-1 rounded-lg">
                  {faculty}
                </span>
              )}
              {role && (
                <span className="badge">{role}</span>
              )}
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {studentId && (
            <div>
              <p className="label">Student ID</p>
              <p className="font-mono font-500 text-ink-700 text-sm">{studentId}</p>
            </div>
          )}
          {faculty && (
            <div>
              <p className="label">Faculty</p>
              <p className="font-body text-ink-700 text-sm">{faculty}</p>
            </div>
          )}
          {role && (
            <div>
              <p className="label">Role</p>
              <p className="font-body text-ink-700 text-sm">{role}</p>
            </div>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <div className="mb-8">
            <p className="label">About</p>
            <p className="font-body text-ink-600 text-base leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Skills */}
        {displaySkills.length > 0 && (
          <div className="mb-8">
            <p className="label">Skills</p>
            <div className="flex flex-wrap gap-2">
              {displaySkills.map((skill) => (
                <span key={skill} className="skill-tag text-sm px-3 py-1.5">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* CV */}
        {cvUrl ? (
          <div className="bg-ink-50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-ink-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="font-display font-600 text-ink-700 text-sm">Curriculum Vitae</p>
                {cvFileName && (
                  <p className="text-xs text-ink-400 font-mono truncate max-w-xs">{cvFileName}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View
              </a>
              <a
                href={cvUrl}
                download
                className="btn-primary text-sm py-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-ink-50 rounded-xl p-5 text-center">
            <p className="text-sm text-ink-400 font-body">No CV uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
