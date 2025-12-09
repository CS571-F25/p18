// src/screens/BountyDetail.jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore, useAuth } from '../store'
import ImageCarousel from '../components/ImageCarousel'
import TypeBadge from '../components/TypeBadge'
import StatusBadge from '../components/StatusBadge'
import StatusButtons from '../components/StatusButtons'
import CommentList from '../components/CommentList'
import { Card, Badge, Alert, Button } from 'react-bootstrap'

export default function BountyDetail() {
  const { posts, setPosts } = usePostsStore()
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find((p) => String(p.id) === String(id))

  // Check if current user is the author
  const isAuthor = user && post && user.id === post.authorId

  const [comment, setComment] = useState('')

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

  const addComment = () => {
    if (!comment.trim()) return
    const next = posts.map((p) =>
      p.id === post.id
        ? {
            ...p,
            comments: [
              ...(p.comments || []),
              { id: Date.now(), text: comment.trim() },
            ],
          }
        : p
    )
    setPosts(next)
    setComment('')
  }

  const changeStatus = (nextStatus) => {
    const next = posts.map((p) =>
      p.id === post.id ? { ...p, status: nextStatus } : p
    )
    setPosts(next)
  }

  const softDelete = () => {
    const next = posts.map((p) =>
      p.id === post.id ? { ...p, deleted: true, status: 'closed' } : p
    )
    setPosts(next)
    navigate('/')
  }

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: post.title },
      ]}
    >
      <Card className="max-w-3xl mx-auto">
        <Card.Body>
          <ImageCarousel images={post.images} title={post.title} />

          <div className="d-flex gap-2 mb-2">
            <TypeBadge type={post.type} />
            <StatusBadge status={post.status} />
          </div>

          <Card.Title as="h1" className="h2 mb-2">
            {post.title}
          </Card.Title>
          {post.price !== undefined && (
            <div className="h3 mb-3 text-primary fw-bold">
              ${post.price}
            </div>
          )}

          <Card.Text className="mb-3">{post.description}</Card.Text>

          {post.tags && post.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-2">
              {post.tags.map((t) => (
                <Badge
                  key={t}
                  bg="secondary"
                  className="cursor-pointer"
                  onClick={() => navigate(`/?tag=${encodeURIComponent(t)}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/?tag=${encodeURIComponent(t)}`)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Filter by tag ${t}`}
                >
                  #{t}
                </Badge>
              ))}
            </div>
          )}

          {post.location && (
            <p className="text-muted small mb-4">{post.location}</p>
          )}

          {isAuthor && (
            <div className="mb-3">
              <Button
                variant="outline-primary"
                onClick={() => navigate(`/bounties/${post.id}/edit`)}
                aria-label="Edit this post"
              >
                Edit Post
              </Button>
            </div>
          )}

          {isAuthor ? (
            <StatusButtons
              currentStatus={post.status}
              onChange={changeStatus}
              onDelete={softDelete}
            />
          ) : (
            <div className="mb-4">
              <div className="d-flex gap-2 align-items-center">
                <StatusBadge status={post.status} />
                <span className="text-muted small">
                  Only the post creator can change the status
                </span>
              </div>
            </div>
          )}

          <CommentList
            comments={post.comments}
            onAddComment={addComment}
            comment={comment}
            setComment={setComment}
          />
        </Card.Body>
      </Card>
    </Layout>
  )
}
