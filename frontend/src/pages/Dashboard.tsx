import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProtected, getErrorMessage } from '../services/api'
import Spinner from '../components/Spinner'

interface Task {
  id: number
  text: string
  done: boolean
}

export default function Dashboard() {
  const [message, setMessage]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [tasks, setTasks]       = useState<Task[]>([])
  const [taskInput, setTaskInput] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getProtected()
      .then(setMessage)
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!taskInput.trim()) return
    setTasks(prev => [...prev, { id: Date.now(), text: taskInput.trim(), done: false }])
    setTaskInput('')
  }

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id: number) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  if (loading) return <Spinner fullPage />

  return (
    <div className="page">
      <div className="card">

        {/* ── Header ── */}
        <div className="dashboard-header">
          <span className="badge">Authenticated</span>
          <button className="btn-logout" onClick={handleLogout}>Log out</button>
        </div>

        <h1>Dashboard</h1>

        {error ? (
          <p className="alert alert-error">{error}</p>
        ) : (
          <p className="welcome-msg">{message}</p>
        )}

        {/* ── To-Do ── */}
        <div className="todo-section">
          <h2>My Tasks</h2>

          <form onSubmit={addTask} className="todo-form">
            <input
              type="text"
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              placeholder="Add a task..."
            />
            <button type="submit" className="btn-add">Add</button>
          </form>

          {tasks.length === 0 ? (
            <p className="todo-empty">No tasks yet. Add one above.</p>
          ) : (
            <ul className="todo-list">
              {tasks.map(task => (
                <li key={task.id} className={task.done ? 'done' : ''}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.text}</span>
                  <button
                    className="btn-delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
