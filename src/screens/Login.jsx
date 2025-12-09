// src/screens/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../store'
import { Card, Form, Button, Alert } from 'react-bootstrap'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return
    }

    try {
      login(username.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Login' },
      ]}
    >
      <Card className="max-w-md mx-auto">
        <Card.Body>
          <Card.Title as="h1" className="h2 mb-3">
            Login
          </Card.Title>
          <Card.Text className="text-muted mb-4">
            Sign in to your account to create posts and interact with the community.
          </Card.Text>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="login-username-input">Username</Form.Label>
              <Form.Control
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                aria-required="true"
                autoComplete="username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="login-password-input">Password</Form.Label>
              <Form.Control
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                aria-required="true"
                autoComplete="current-password"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mb-3">
              Login
            </Button>

            <div className="text-center">
              <small className="text-muted">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary text-decoration-none">
                  Register here
                </Link>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  )
}

