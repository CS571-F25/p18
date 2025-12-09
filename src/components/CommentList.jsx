// src/components/CommentList.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Form, Button, InputGroup, ButtonGroup } from 'react-bootstrap'

export default function CommentList({
  comments,
  onAddComment,
  comment,
  setComment,
  currentUserId,
  onEditComment,
  onDeleteComment,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const startEdit = (comment) => {
    setEditingId(comment.id)
    setEditText(comment.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = (commentId) => {
    if (!editText.trim()) return
    onEditComment(commentId, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  return (
    <div>
      <h2 className="h4 mb-3">Questions &amp; Comments</h2>
      <div className="mb-3">
        {comments && comments.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {comments.map((c) => {
              const isCommentAuthor = currentUserId && c.authorId === currentUserId
              const isEditing = editingId === c.id

              return (
                <Card key={c.id} className="bg-light">
                  <Card.Body className="py-2">
                    {isEditing ? (
                      <div className="d-flex flex-column gap-2">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          aria-label="Edit comment"
                        />
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => saveEdit(c.id)}
                            aria-label="Save comment"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={cancelEdit}
                            aria-label="Cancel editing"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-start">
                        <p className="mb-0 small flex-grow-1">{c.text}</p>
                        {isCommentAuthor && (
                          <ButtonGroup size="sm" className="ms-2">
                            <Button
                              variant="outline-primary"
                              onClick={() => startEdit(c)}
                              aria-label="Edit comment"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => onDeleteComment(c.id)}
                              aria-label="Delete comment"
                            >
                              Delete
                            </Button>
                          </ButtonGroup>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        ) : (
          <p className="text-muted small">No comments yet.</p>
        )}
      </div>

      {currentUserId ? (
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
      ) : (
        <div className="text-muted small text-center p-2 bg-light rounded">
          Please{' '}
          <Link to="/register" className="text-primary text-decoration-none">
            register
          </Link>{' '}
          to post comments.
        </div>
      )}
    </div>
  )
}
