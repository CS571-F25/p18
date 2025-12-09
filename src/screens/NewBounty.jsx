// src/screens/NewBounty.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore } from '../store'
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'

export default function NewBounty() {
  const { posts, setPosts } = usePostsStore()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('bounty')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [imageUrls, setImageUrls] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }

    if (type === 'bounty' && price !== '') {
      const n = Number(price)
      if (Number.isNaN(n) || n < 0) {
        setError('Reward must be a non-negative number.')
        return
      }
    }

    const nextId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const images = imageUrls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)

    const newPost = {
      id: nextId,
      title: title.trim(),
      type,
      price: price === '' ? undefined : Number(price),
      description: description.trim(),
      status: 'open',
      tags,
      location: location.trim(),
      images,
      comments: [],
    }

    setPosts([...posts, newPost])
    navigate(`/bounties/${nextId}`)
  }

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: 'New Bounty' },
      ]}
    >
      <Card className="max-w-3xl mx-auto">
        <Card.Body>
          <Card.Title as="h1" className="h2 mb-4">
            Create a New Bounty
          </Card.Title>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="title-input">Title</Form.Label>
              <Form.Control
                id="title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Need help moving boxes"
                required
                aria-required="true"
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label htmlFor="type-select">Type</Form.Label>
                  <Form.Select
                    id="type-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    aria-label="Post type"
                  >
                    <option value="bounty">Bounty</option>
                    <option value="sale">Sale</option>
                    <option value="free">Free</option>
                    <option value="activity">Activity</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label htmlFor="price-input">Reward / Price</Form.Label>
                  <Form.Control
                    id="price-input"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={
                      type === 'free' || type === 'activity'
                        ? 'N/A for this type'
                        : '$'
                    }
                    aria-label="Price or reward amount"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label htmlFor="location-input">Location</Form.Label>
                  <Form.Control
                    id="location-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Downtown"
                    aria-label="Location"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="description-textarea">Description</Form.Label>
              <Form.Control
                id="description-textarea"
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you need help with, estimated time, any tools required..."
                required
                aria-required="true"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="tags-input">Tags (comma separated)</Form.Label>
              <Form.Control
                id="tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="moving, heavy, car-needed"
                aria-label="Tags"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="images-input">
                Image URLs (optional, comma separated)
              </Form.Label>
              <Form.Control
                id="images-input"
                type="text"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://..., https://..."
                aria-label="Image URLs"
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Publish Bounty
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  )
}
