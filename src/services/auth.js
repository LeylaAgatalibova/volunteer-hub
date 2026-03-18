// src/services/auth.js
// Firebase Authentication helpers

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase'

export async function login(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logout() {
  await signOut(auth)
}

export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}
