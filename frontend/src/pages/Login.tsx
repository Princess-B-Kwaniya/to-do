import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login, getErrorMessage } from '../services/api'
import Spinner from '../components/Spinner'

interface LocationState {
  registered?: boolean
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const navigate  = useNavigate()
  const location  = useLocation()
  const registered = (location.state as LocationState | null)?.registered ?? false

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = await login(username, password)
      localStorage.setItem('token', token)
      navigate('/protected')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Sign in</h1>

        {registered && (
          <p className="alert alert-success">Account created — you can now sign in.</p>
        )}
        {error && <p className="alert alert-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Spinner /> : 'Sign in'}
          </button>
        </form>

        <p className="switch">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
