import axios from 'axios'

/** Prefer VITE_API_URL; dev uses Vite proxy so '' → /api */
const base =
  typeof import.meta.env.VITE_API_URL === 'string' && import.meta.env.VITE_API_URL.trim()
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : ''

export const api = axios.create({
  baseURL: base ? `${base}/api` : '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})
