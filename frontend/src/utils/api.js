import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
