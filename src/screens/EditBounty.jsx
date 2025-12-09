// src/screens/EditBounty.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore, useAuth } from '../store'
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'

export default function EditBounty() {
  const { posts, setPosts } = usePostsStore()
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find((p) => String(p.id) === String(id))

  const [title, setTitle] = useState('')
  const [type, setType] = useState('bounty')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [imageUrls, setImageUrls] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (post) {
      setTitle(post.title || '')
      setType(post.type || 'bounty')
      setPrice(post.price !== undefined ? String(post.price) : '')
      setDescription(post.description || '')
      setLocation(post.location || '')
      setTagsInput((post.tags || []).join(', '))
      setImageUrls((post.images || []).join(', '))
    }
  }, [post])

  if (!post || post.deleted) {
    return (
      <Layout
        crumbs={[
          { label: 'Home', path: '/' },
          { label: 'Post not found' },
        ]}
      >
        <Alert variant="warning">Post not found or has been removed.</Alert>
      </Layout>
    )
  }

  // Check if user is the author
  if (!user || user.id !== post.authorId) {
    return (
      <Layout
        crumbs={[
          { label: 'Home', path: '/' },
          { label: 'Edit Post' },
        ]}
      >
        <Alert variant="danger">
          You don't have permission to edit this post. Only the post creator can
          edit it.
        </Alert>
      </Layout>
    )
  }

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

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const images = imageUrls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)

    const updatedPost = {
      ...post,
      title: title.trim(),
      type,
      price: price === '' ? undefined : Number(price),
      description: description.trim(),
      tags,
      location: location.trim(),
      images,
      updatedAt: new Date().toISOString(),
    }

    const next = posts.map((p) => (p.id === post.id ? updatedPost : p))
    setPosts(next)
    navigate(`/bounties/${post.id}`)
  }

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: post.title, path: `/bounties/${post.id}` },
        { label: 'Edit' },
      ]}
    >
      <Card className="max-w-3xl mx-auto">
        <Card.Body>
          <Card.Title as="h1" className="h2 mb-4">
            Edit Post
          </Card.Title>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="edit-title-input">Title</Form.Label>
              <Form.Control
                id="edit-title-input"
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
                  <Form.Label htmlFor="edit-type-select">Type</Form.Label>
                  <Form.Select
                    id="edit-type-select"
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
                  <Form.Label htmlFor="edit-price-input">Reward / Price</Form.Label>
                  <Form.Control
                    id="edit-price-input"
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
                  <Form.Label htmlFor="edit-location-input">Location</Form.Label>
                  <Form.Control
                    id="edit-location-input"
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
              <Form.Label htmlFor="edit-description-textarea">
                Description
              </Form.Label>
              <Form.Control
                id="edit-description-textarea"
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
              <Form.Label htmlFor="edit-tags-input">
                Tags (comma separated)
              </Form.Label>
              <Form.Control
                id="edit-tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="moving, heavy, car-needed"
                aria-label="Tags"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="edit-images-input">
                Image URLs (optional, comma separated)
              </Form.Label>
              <Form.Control
                id="edit-images-input"
                type="text"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://..., https://..."
                aria-label="Image URLs"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate(`/bounties/${post.id}`)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  )
}

