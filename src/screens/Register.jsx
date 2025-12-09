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

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Register' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!name.trim()) newErrors.name = 'Name is required.'
    if (!email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    register(name.trim(), email.trim())
    showToast('Registered successfully!', 'success')
    navigate('/')
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
        <h2 className="text-xl font-semibold mb-4">
          Register
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          This is a lightweight demo registration used only on the client
          side to attach posts and actions to your name.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              className={`${inputClass} ${
                errors.name ? 'border-red-500' : ''
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errorText(errors.name)}
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
            />
            {errorText(errors.email)}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-3 py-2 text-xs border rounded text-gray-600 hover:bg-gray-50"
            >
              Cancel
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
