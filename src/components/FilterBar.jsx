// src/components/FilterBar.jsx
import { Form, Card } from 'react-bootstrap'

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  status,
  setStatus,
  min,
  setMin,
  max,
  setMax,
  tags,
  setTags,
}) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="row g-3">
          <div className="col-md-4">
            <Form.Label htmlFor="search-input" className="visually-hidden">
              Search posts
            </Form.Label>
            <Form.Control
              id="search-input"
              type="text"
              placeholder="Search title, description, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search posts"
            />
          </div>

          <div className="col-md-4">
            <Form.Label htmlFor="status-select" className="visually-hidden">
              Filter by status
            </Form.Label>
            <Form.Select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              {['all', 'open', 'claimed', 'completed', 'closed'].map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-4">
            <div className="row g-2">
              <div className="col-6">
                <Form.Label htmlFor="min-price" className="visually-hidden">
                  Minimum price
                </Form.Label>
                <Form.Control
                  id="min-price"
                  type="number"
                  min="0"
                  placeholder="Min $"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  aria-label="Minimum price"
                />
              </div>
              <div className="col-6">
                <Form.Label htmlFor="max-price" className="visually-hidden">
                  Maximum price
                </Form.Label>
                <Form.Control
                  id="max-price"
                  type="number"
                  min="0"
                  placeholder="Max $"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Form.Label htmlFor="tags-input" className="visually-hidden">
            Filter by tags
          </Form.Label>
          <Form.Control
            id="tags-input"
            type="text"
            placeholder="Tags (comma separated, e.g. furniture, free)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            aria-label="Filter by tags"
          />
        </div>
      </Card.Body>
    </Card>
  )
}


