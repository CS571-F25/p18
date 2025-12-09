// src/components/PostCard.jsx
import { useNavigate } from 'react-router-dom'
import { Card, Badge } from 'react-bootstrap'
import TypeBadge from './TypeBadge'
import StatusBadge from './StatusBadge'

export default function PostCard({ post, onTagClick }) {
  const navigate = useNavigate()

  const handleTagClick = (e, tag) => {
    e.stopPropagation()
    if (onTagClick) {
      onTagClick(tag)
    }
  }

  return (
    <Card
      className="h-100 cursor-pointer"
      onClick={() => navigate(`/bounties/${post.id}`)}
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
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <TypeBadge type={post.type} />
            <StatusBadge status={post.status} />
          </div>
          {post.price !== undefined && (
            <div className="h5 mb-0 fw-bold text-dark">${post.price}</div>
          )}
        </div>

        <Card.Title as="h2" className="h5 mb-2">
          {post.title}
        </Card.Title>
        <Card.Text className="text-muted small mb-2 flex-grow-1">
          {post.description}
        </Card.Text>

        {post.tags && post.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {post.tags.map((t) => (
              <Badge
                key={t}
                bg="secondary"
                className="text-xs cursor-pointer"
                onClick={(e) => handleTagClick(e, t)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    if (onTagClick) {
                      onTagClick(t)
                    }
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
          <small className="text-muted">{post.location}</small>
        )}
      </Card.Body>
    </Card>
  )
}

