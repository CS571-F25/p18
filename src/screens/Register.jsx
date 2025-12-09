// src/screens/Register.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../store'
import { Card, Form, Button, Alert } from 'react-bootstrap'

export default function Register() {
  const { register, isUsernameTaken } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  // Check username availability as user types
  useEffect(() => {
    if (username.trim().length > 0) {
      if (isUsernameTaken(username)) {
        setUsernameError('This username is already taken.')
      } else {
        setUsernameError('')
      }
    } else {
      setUsernameError('')
    }
  }, [username, isUsernameTaken])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!username.trim()) {
      setError('Username is required.')
      return
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.')
      return
    }

    if (isUsernameTaken(username)) {
      setError('This username is already taken. Please choose another.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      register(username.trim(), email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: 'Register' },
      ]}
    >
      <Card className="max-w-md mx-auto">
        <Card.Body>
          <Card.Title as="h1" className="h2 mb-3">
            Register
          </Card.Title>
          <Card.Text className="text-muted mb-4">
            Create an account to start posting bounties, items for sale, and
            activities.
          </Card.Text>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="register-username-input">
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="register-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                required
                aria-required="true"
                autoComplete="username"
                isInvalid={!!usernameError}
              />
              {usernameError && (
                <Form.Control.Feedback type="invalid">
                  {usernameError}
                </Form.Control.Feedback>
              )}
              <Form.Text className="text-muted">
                Username must be unique and at least 3 characters.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="register-email-input">Email</Form.Label>
              <Form.Control
                id="register-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional, e.g. netid@wisc.edu"
                aria-label="Email address (optional)"
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="register-password-input">
                Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="register-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                aria-required="true"
                autoComplete="new-password"
                minLength={4}
              />
              <Form.Text className="text-muted">
                Password must be at least 4 characters long.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="register-confirm-password-input">
                Confirm Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                id="register-confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                aria-required="true"
                autoComplete="new-password"
                isInvalid={password !== confirmPassword && confirmPassword.length > 0}
              />
              {password !== confirmPassword && confirmPassword.length > 0 && (
                <Form.Control.Feedback type="invalid">
                  Passwords do not match.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 mb-3"
              disabled={!!usernameError}
            >
              Register
            </Button>

            <div className="text-center">
              <small className="text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-primary text-decoration-none">
                  Login here
                </Link>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  )
}
