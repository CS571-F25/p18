// src/components/StatusBadge.jsx
import { Badge } from 'react-bootstrap'

export default function StatusBadge({ status }) {
  const variantMap = {
    open: 'success',
    claimed: 'warning',
    completed: 'primary',
    closed: 'secondary',
  }

  return (
    <Badge bg={variantMap[status] || 'secondary'} className="text-uppercase">
      {status}
    </Badge>
  )
}


