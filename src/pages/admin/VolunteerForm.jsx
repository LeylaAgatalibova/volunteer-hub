import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { addVolunteer, updateVolunteer, getVolunteerById } from '../../services/volunteers'
import { uploadCV } from '../../services/storage'
import CVDropzone from '../../components/admin/CVDropzone'
import SkillTagInput from '../../components/admin/SkillTagInput'
import toast from 'react-hot-toast'

const FACULTIES = [
  'Nəqliyyat və Sənaye Texnologiyaları', 'Qida mühəndisliyi', 'Avtomatika, telekommunikasiya və informatika', 'İqtisadiyyat və idarəetmə',
  'Turizm',
]

const ROLES = [
  'Developer', 'Dizayner', 'Layihə İdarəetməsi',
  'Tələbələrlə iş', 'Təlim', 'Other',
]

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  studentId: '',
  faculty: '',
  role: '',
  bio: '',
  skills: [],
}

export default function VolunteerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY_FORM)
  const [cvFile, setCvFile] = useState(null)
  const [existingCv, setExistingCv] = useState(null) // { url, fileName, storagePath }
  const [uploadProgress, setUploadProgress] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingVolunteer, setLoadingVolunteer] = useState(isEdit)
  const [errors, setErrors] = useState({})

  // Load existing volunteer for edit
  useEffect(() => {
    if (!isEdit) return
    async function load() {
      try {
        const v = await getVolunteerById(id)
        setForm({
          firstName: v.firstName || '',
          lastName: v.lastName || '',
          studentId: v.studentId || '',
          faculty: v.faculty || '',
          role: v.role || '',
          bio: v.bio || '',
          skills: Array.isArray(v.skills) ? v.skills : [],
        })
        if (v.cvUrl) {
          setExistingCv({ url: v.cvUrl, fileName: v.cvFileName, storagePath: v.storagePath })
        }
      } catch (err) {
        toast.error('Could not load volunteer: ' + err.message)
        navigate('/admin')
      } finally {
        setLoadingVolunteer(false)
      }
    }
    load()
  }, [id, isEdit, navigate])

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  function validate() {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.lastName.trim()) errs.lastName = 'Required'
    if (!form.studentId.trim()) errs.studentId = 'Required'
    if (!form.faculty) errs.faculty = 'Please select a faculty'
    if (!isEdit && !cvFile) errs.cv = 'Please upload a CV file'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please fix the errors below')
      return
    }

    setSubmitting(true)
    try {
      let cvData = existingCv
        ? { cvUrl: existingCv.url, cvFileName: existingCv.fileName, storagePath: existingCv.storagePath }
        : {}

      // Upload new CV if provided
      if (cvFile) {
        setUploadProgress(0)
        const result = await uploadCV(cvFile, form.studentId, setUploadProgress)
        cvData = { cvUrl: result.url, cvFileName: result.fileName, storagePath: result.storagePath }
        setUploadProgress(null)
      }

      const payload = { ...form, ...cvData }

      if (isEdit) {
        await updateVolunteer(id, payload)
        toast.success('Volunteer updated!')
      } else {
        await addVolunteer(payload)
        toast.success('Volunteer added!')
      }

      navigate('/admin')
    } catch (err) {
      toast.error('Error: ' + err.message)
      setUploadProgress(null)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingVolunteer) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link to="/admin" className="text-ink-400 hover:text-ink-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display font-800 text-2xl text-ink-800">
            {isEdit ? 'Edit Volunteer' : 'Add Volunteer'}
          </h1>
          <p className="text-sm text-ink-400 font-body">
            {isEdit ? 'Update volunteer information' : 'Add a new student volunteer to the registry'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-display font-700 text-ink-700 text-sm uppercase tracking-widest">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`input ${errors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                placeholder="Ada"
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`input ${errors.lastName ? 'border-red-400' : ''}`}
                placeholder="Lovelace"
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Student ID *</label>
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => handleChange('studentId', e.target.value)}
                className={`input font-mono ${errors.studentId ? 'border-red-400' : ''}`}
                placeholder="STU20240001"
              />
              {errors.studentId && <p className="text-xs text-red-500 mt-1">{errors.studentId}</p>}
            </div>
            <div>
              <label className="label">Faculty *</label>
              <select
                value={form.faculty}
                onChange={(e) => handleChange('faculty', e.target.value)}
                className={`input appearance-none ${errors.faculty ? 'border-red-400' : ''}`}
              >
                <option value="">Select faculty…</option>
                {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              {errors.faculty && <p className="text-xs text-red-500 mt-1">{errors.faculty}</p>}
            </div>
          </div>

         <div>
  <label className="label">Role <span className="text-ink-300 normal-case tracking-normal font-body font-400">(optional)</span></label>
  <div className="flex flex-col gap-2">
    <select
      value={ROLES.includes(form.role) ? form.role : form.role ? 'custom' : ''}
      onChange={(e) => {
        if (e.target.value === 'custom') return
        handleChange('role', e.target.value)
      }}
      className="input appearance-none"
    >
      <option value="">Rol seçin…</option>
      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      <option value="custom">✏️ Yaz…</option>
    </select>
    <input
      type="text"
      value={form.role}
      onChange={(e) => handleChange('role', e.target.value)}
      className="input"
      placeholder="Rol adını yazın və ya yuxarıdan seçin…"
    />
  </div>
</div>

          <div>
            <label className="label">Bio <span className="text-ink-300 normal-case tracking-normal font-body font-400">(optional)</span></label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="input resize-none"
              rows={3}
              placeholder="A short description about this volunteer…"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-700 text-ink-700 text-sm uppercase tracking-widest">
            Skills
          </h2>
          <SkillTagInput
            skills={form.skills}
            onChange={(skills) => handleChange('skills', skills)}
          />
        </div>

        {/* CV Upload */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-700 text-ink-700 text-sm uppercase tracking-widest">
            CV / Resume {!isEdit && <span className="text-red-400">*</span>}
          </h2>
          <CVDropzone
            onFileSelect={setCvFile}
            currentFileName={existingCv?.fileName}
            uploadProgress={uploadProgress}
          />
          {errors.cv && <p className="text-xs text-red-500">{errors.cv}</p>}
          {existingCv?.url && !cvFile && (
            <a
              href={existingCv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-700 font-mono transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View current CV
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <Link to="/admin" className="btn-secondary justify-center">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary justify-center"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {uploadProgress !== null ? `Uploading ${uploadProgress}%…` : 'Saving…'}
              </>
            ) : isEdit ? 'Update Volunteer' : 'Add Volunteer'}
          </button>
        </div>
      </form>
    </div>
  )
}
