// src/screens/MyBounties.jsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore } from '../store'
import StatusBadge from '../components/StatusBadge'
import { Card, ListGroup, Alert } from 'react-bootstrap'

export default function MyBounties() {
  const { posts } = usePostsStore()
  const navigate = useNavigate()

  const grouped = useMemo(() => {
    const result = {
      open: [],
      claimed: [],
      completed: [],
      closed: [],
    }
    posts
      .filter((p) => p.type === 'bounty' && !p.deleted)
      .forEach((p) => {
        if (!result[p.status]) result[p.status] = []
        result[p.status].push(p)
      })
    return result
  }, [posts])

  const order = ['open', 'claimed', 'completed', 'closed']

  const hasAnyPosts = order.some((k) => (grouped[k] || []).length > 0)

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: 'My Bounties' },
      ]}
    >
      <div className="max-w-4xl">
        <h1 className="h2 mb-3">My Bounties</h1>
        <p className="text-muted mb-4">
          Prototype view of all bounty posts, grouped by status.
        </p>

        {!hasAnyPosts ? (
          <Alert variant="info">
            No bounty posts yet. Try creating one from the &quot;New Post&quot;
            button.
          </Alert>
        ) : (
          order.map((statusKey) => {
            const list = grouped[statusKey] || []
            if (list.length === 0) return null
            return (
              <Card key={statusKey} className="mb-4">
                <Card.Header>
                  <div className="d-flex align-items-center gap-2">
                    <StatusBadge status={statusKey} />
                    <span className="text-muted small">
                      {list.length} bounties
                    </span>
                  </div>
                </Card.Header>
                <ListGroup variant="flush">
                  {list.map((post) => (
                    <ListGroup.Item
                      key={post.id}
                      action
                      onClick={() => navigate(`/bounties/${post.id}`)}
                      className="d-flex justify-content-between align-items-center"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/bounties/${post.id}`)
                        }
                      }}
                      aria-label={`View ${post.title}`}
                    >
                      <div>
                        <div className="fw-medium">{post.title}</div>
                        {post.location && (
                          <div className="text-muted small">{post.location}</div>
                        )}
                      </div>
                      {post.price !== undefined && (
                        <div className="fw-semibold">${post.price}</div>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            )
          })
        )}
      </div>
    </Layout>
  )
}
