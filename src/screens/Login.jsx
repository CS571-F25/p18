import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth, useToast } from '../store'

const inputClass =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

export default function Login() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = location.state?.from || '/'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Login' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!identifier.trim()) newErrors.identifier = 'Email or username required.'
    if (!password.trim()) newErrors.password = 'Password required.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const result = login(identifier.trim(), password.trim())
    if (!result.ok) {
      showToast(result.error || 'Login failed', 'error')
      return
    }
    showToast('Logged in!', 'success')
    navigate(redirect)
  }

  const errorText = (msg) =>
    msg && (
      <p className="mt-1 text-xs text-red-500">
        {msg}
      </p>
    )

  return (
    <Layout crumbs={crumbs}>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email or Username
            </label>
            <input
              className={`${inputClass} ${
                errors.identifier ? 'border-red-500' : ''
              }`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="name@wisc.edu or username"
            />
            {errorText(errors.identifier)}
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
              placeholder="Your password"
            />
            {errorText(errors.password)}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="px-3 py-2 text-xs border rounded text-gray-600 hover:bg-gray-50"
            >
              Create account
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

