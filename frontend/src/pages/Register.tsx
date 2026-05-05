import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, getErrorMessage } from '../services/api'
import Spinner from '../components/Spinner'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(username, password)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Create account</h1>

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
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Spinner /> : 'Register'}
          </button>
        </form>

        <p className="switch">
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
