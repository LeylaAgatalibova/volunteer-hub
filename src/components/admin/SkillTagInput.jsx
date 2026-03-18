import { useState, useRef } from 'react'

const SUGGESTED_SKILLS = [
  'React', 'Python', 'JavaScript', 'TypeScript', 'Node.js', 'Java',
  'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Figma',
  'Marketing', 'Content Writing', 'Research', 'Project Management',
  'Public Speaking', 'Photography', 'Video Editing', 'Graphic Design',
  'SQL', 'Firebase', 'Flutter', 'Swift', 'C++', 'R', 'MATLAB',
]

export default function SkillTagInput({ skills, onChange }) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  const suggestions = SUGGESTED_SKILLS.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !skills.includes(s) &&
      input.length > 0
  ).slice(0, 6)

  function addSkill(skill) {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed])
    }
    setInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function removeSkill(skill) {
    onChange(skills.filter((s) => s !== skill))
  }

  function handleKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addSkill(input)
    }
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1])
    }
  }

  return (
    <div className="space-y-2 relative">
      {/* Tags + input */}
      <div
        className="min-h-[44px] w-full px-3 py-2 bg-white border border-ink-200 rounded-lg flex flex-wrap gap-1.5 items-center cursor-text focus-within:ring-2 focus-within:ring-ink-400/30 focus-within:border-ink-400 transition-all"
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-500 bg-sage-400/10 text-sage-600 border border-sage-400/20"
          >
            {skill}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeSkill(skill) }}
              className="text-sage-500 hover:text-red-400 transition-colors ml-0.5"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-ink-700 placeholder:text-ink-300 outline-none font-body"
        />
      </div>

      {/* Autocomplete */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-ink-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => addSkill(s)}
              className="w-full text-left px-4 py-2.5 text-sm font-body text-ink-700 hover:bg-ink-50 transition-colors flex items-center gap-2"
            >
              <span className="text-ink-300 text-xs font-mono">+</span>
              {s}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-400 font-body">
        Press <kbd className="font-mono bg-ink-100 px-1 py-0.5 rounded text-ink-500">Enter</kbd> or <kbd className="font-mono bg-ink-100 px-1 py-0.5 rounded text-ink-500">,</kbd> to add a skill
      </p>
    </div>
  )
}
