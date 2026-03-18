import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

export default function CVDropzone({ onFileSelect, currentFileName, uploadProgress }) {
  const [dragError, setDragError] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    setDragError(null)
    if (rejected.length > 0) {
      setDragError('Only PDF, DOC, or DOCX files are accepted.')
      return
    }
    if (accepted.length > 0) {
      onFileSelect(accepted[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    multiple: false,
  })

  const selectedFile = acceptedFiles[0]

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? 'border-ember-400 bg-ember-400/5'
            : 'border-ink-200 bg-ink-50 hover:border-ink-400 hover:bg-white'
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isDragActive ? 'bg-ember-400/10' : 'bg-ink-100'
          }`}>
            <svg className={`w-5 h-5 ${isDragActive ? 'text-ember-500' : 'text-ink-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          {isDragActive ? (
            <p className="text-sm font-display font-600 text-ember-500">Drop your file here</p>
          ) : selectedFile ? (
            <div>
              <p className="text-sm font-display font-600 text-ink-700">{selectedFile.name}</p>
              <p className="text-xs text-ink-400 font-mono mt-1">
                {(selectedFile.size / 1024).toFixed(0)} KB · Click to replace
              </p>
            </div>
          ) : currentFileName ? (
            <div>
              <p className="text-sm font-display font-600 text-ink-600">Current: {currentFileName}</p>
              <p className="text-xs text-ink-400 font-body mt-1">Drag & drop or click to replace</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-display font-600 text-ink-600">
                Drag & drop your CV here
              </p>
              <p className="text-xs text-ink-400 font-body mt-1">PDF, DOC, DOCX · or click to browse</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload progress */}
      {uploadProgress !== null && uploadProgress !== undefined && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-ink-400 font-mono">
            <span>Uploading…</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-ember-500 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {dragError && (
        <p className="text-xs text-red-500 font-body">{dragError}</p>
      )}
    </div>
  )
}
