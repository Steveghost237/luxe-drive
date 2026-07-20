import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('luxe-drive-auth') || '{}')
    const token = stored?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (_) {}
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('luxe-drive-auth')
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  }
)

export default api
