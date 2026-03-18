// src/services/volunteers.js
// All Firestore operations for volunteers

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'volunteers'

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Fetch all volunteers, ordered by creation date (newest first)
 * Client-side filtering is used for multi-field search to keep it simple
 * and avoid requiring composite Firestore indexes.
 */
export async function getAllVolunteers() {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Fetch a single volunteer by document ID
 */
export async function getVolunteerById(id) {
  const ref = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Volunteer not found')
  return { id: snap.id, ...snap.data() }
}

// ─── Write ───────────────────────────────────────────────────────────────────

/**
 * Add a new volunteer document
 * @param {Object} data - Volunteer fields (see data model below)
 *
 * Data model:
 * {
 *   firstName: string,
 *   lastName: string,
 *   faculty: string,
 *   studentId: string,
 *   role: string (optional),
 *   skills: string[] (array of skill tags),
 *   bio: string (optional),
 *   cvUrl: string (Firebase Storage download URL),
 *   cvFileName: string (original file name for display),
 * }
 */
export async function addVolunteer(data) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    skills: data.skills || [],
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/**
 * Update an existing volunteer document
 */
export async function updateVolunteer(id, data) {
  const ref = doc(db, COLLECTION, id)
  await updateDoc(ref, {
    ...data,
    skills: data.skills || [],
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a volunteer document
 */
export async function deleteVolunteer(id) {
  const ref = doc(db, COLLECTION, id)
  await deleteDoc(ref)
}

// ─── Client-side filtering ───────────────────────────────────────────────────

/**
 * Filter a volunteers array locally.
 * Called after getAllVolunteers() to avoid multiple Firestore indexes.
 */
export function filterVolunteers(volunteers, { search, faculty, role, skill }) {
  return volunteers.filter((v) => {
    const fullName = `${v.firstName} ${v.lastName}`.toLowerCase()
    const matchesSearch = !search || fullName.includes(search.toLowerCase())
    const matchesFaculty = !faculty || v.faculty === faculty
    const matchesRole = !role || v.role === role
    const matchesSkill =
      !skill ||
      (Array.isArray(v.skills) && v.skills.some((s) => s.toLowerCase() === skill.toLowerCase()))
    return matchesSearch && matchesFaculty && matchesRole && matchesSkill
  })
}

// ─── Derived helpers ─────────────────────────────────────────────────────────

export function getUniqueValues(volunteers, field) {
  const vals = new Set()
  volunteers.forEach((v) => {
    if (field === 'skills' && Array.isArray(v.skills)) {
      v.skills.forEach((s) => s && vals.add(s))
    } else if (v[field]) {
      vals.add(v[field])
    }
  })
  return Array.from(vals).sort()
}
