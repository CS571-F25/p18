// src/components/CommentList.jsx
import { Card, Form, Button, InputGroup } from 'react-bootstrap'

export default function CommentList({ comments, onAddComment, comment, setComment }) {
  return (
    <div>
      <h2 className="h4 mb-3">Questions &amp; Comments</h2>
      <div className="mb-3">
        {comments && comments.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {comments.map((c) => (
              <Card key={c.id} className="bg-light">
                <Card.Body className="py-2">
                  <p className="mb-0 small">{c.text}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted small">No comments yet.</p>
        )}
      </div>

      <Form
        onSubmit={(e) => {
          e.preventDefault()
          onAddComment()
        }}
      >
        <Form.Label htmlFor="comment-input" className="visually-hidden">
          Add a comment
        </Form.Label>
        <InputGroup>
          <Form.Control
            id="comment-input"
            type="text"
            placeholder="Ask a question or express interest..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="Comment text"
          />
          <Button type="submit" variant="primary">
            Post
          </Button>
        </InputGroup>
      </Form>
    </div>
  )
}


