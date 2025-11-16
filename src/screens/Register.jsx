// src/screens/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../store'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    register(name.trim(), email.trim())
    navigate('/')
  }

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Register' },
      ]}
    >
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <p className="text-sm text-gray-600 mb-4">
          Simple prototype registration. We only store a display name and
          optional email in local storage so your posts feel more personal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Optional, e.g. netid@wisc.edu"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
