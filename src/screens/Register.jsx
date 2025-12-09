// src/screens/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../store'
import { Card, Form, Button } from 'react-bootstrap'

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
      <Card className="max-w-md mx-auto">
        <Card.Body>
          <Card.Title as="h1" className="h2 mb-3">
            Register
          </Card.Title>
          <Card.Text className="text-muted mb-4">
            Simple prototype registration. We only store a display name and
            optional email in local storage so your posts feel more personal.
          </Card.Text>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="name-input">Name</Form.Label>
              <Form.Control
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                required
                aria-required="true"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="email-input">Email</Form.Label>
              <Form.Control
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional, e.g. netid@wisc.edu"
                aria-label="Email address (optional)"
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Save
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  )
}
