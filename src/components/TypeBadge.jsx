// src/components/TypeBadge.jsx
import { Badge } from 'react-bootstrap'

export default function TypeBadge({ type }) {
  const variantMap = {
    sale: 'primary',
    free: 'success',
    bounty: 'info',
    activity: 'warning',
  }

  return (
    <Badge bg={variantMap[type] || 'secondary'} className="text-uppercase">
      {type}
    </Badge>
  )
}


