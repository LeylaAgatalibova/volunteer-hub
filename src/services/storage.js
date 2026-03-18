// src/services/storage.js
// Cloudinary ilə CV fayl idarəetməsi (pulsuz, kart lazım deyil)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export function isValidCVFile(file) {
  return ACCEPTED_TYPES.includes(file.type)
}

/**
 * CV faylını Cloudinary-ə yüklə
 * @param {File} file
 * @param {string} studentId
 * @param {function} onProgress - callback(percent)
 * @returns {Promise<{url, fileName, storagePath}>}
 */
export async function uploadCV(file, studentId, onProgress) {
  if (!isValidCVFile(file)) {
    throw new Error('Yalnız PDF, DOC və ya DOCX faylları qəbul edilir.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('public_id', `${studentId}_${Date.now()}`)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress?.(percent)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve({
          url: data.secure_url,
          fileName: file.name,
          storagePath: data.public_id,
        })
      } else {
        reject(new Error('Yükləmə uğursuz oldu: ' + xhr.statusText))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Şəbəkə xətası baş verdi'))
    })

    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`
    )
    xhr.send(formData)
  })
}

/**
 * Cloudinary pulsuz planda frontend-dən silmə dəstəkləmir.
 * Fayl Cloudinary-də qalır, amma Firestore-dan silinir.
 */
export async function deleteCV(storagePath) {
  console.log('CV Cloudinary-dən əl ilə silinməlidir:', storagePath)
}