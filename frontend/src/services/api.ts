import axios from 'axios'

interface ApiError {
  detail: string
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-Type': 'application/json' },
})

// Attach stored token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined
    return data?.detail ?? 'Request failed'
  }
  return 'Network error — is the backend running?'
}

export async function register(username: string, password: string): Promise<void> {
  await api.post<{ message: string }>('/register', { username, password })
}

export async function login(username: string, password: string): Promise<string> {
  const { data } = await api.post<{ token: string }>('/login', { username, password })
  return data.token
}

export async function getProtected(): Promise<string> {
  const { data } = await api.get<{ message: string }>('/protected')
  return data.message
}
