// src/components/StatusButtons.jsx
import { Button, ButtonGroup } from 'react-bootstrap'

export default function StatusButtons({ currentStatus, onChange, onDelete }) {
  const statuses = ['open', 'claimed', 'completed', 'closed']

  return (
    <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
      <ButtonGroup aria-label="Change post status">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={currentStatus === s ? 'primary' : 'outline-secondary'}
            onClick={() => onChange(s)}
            aria-pressed={currentStatus === s}
            aria-label={`Set status to ${s}`}
          >
            {s}
          </Button>
        ))}
      </ButtonGroup>
      <Button
        variant="outline-danger"
        onClick={onDelete}
        className="ms-auto"
        aria-label="Delete this post"
      >
        Soft delete
      </Button>
    </div>
  )
}


