import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth, useToast } from '../store'

const inputClass =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

export default function Register() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Register' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!username.trim()) newErrors.username = 'Username is required.'
    if (!email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email.'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.'
    } else if (password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const result = register(
      username.trim(),
      email.trim(),
      password.trim()
    )
    if (!result.ok) {
      showToast(result.error || 'Registration failed', 'error')
      return
    }

    showToast('Registered successfully!', 'success')
    navigate('/')
  }

  const errorText = (msg) =>
    msg && (
      <p className="mt-1 text-xs text-red-600">
        {msg}
      </p>
    )

  return (
    <Layout crumbs={crumbs}>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Register
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Choose a unique username and set a password to log in.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              className={`${inputClass} ${
                errors.username ? 'border-red-500' : ''
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Unique username"
            />
            {errorText(errors.username)}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              className={`${inputClass} ${
                errors.email ? 'border-red-500' : ''
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="name@wisc.edu"
            />
            {errorText(errors.email)}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              className={`${inputClass} ${
                errors.password ? 'border-red-500' : ''
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="At least 6 characters"
            />
            {errorText(errors.password)}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-3 py-2 text-xs border rounded text-gray-600 hover:bg-gray-50"
            >
              Have an account? Log in
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
