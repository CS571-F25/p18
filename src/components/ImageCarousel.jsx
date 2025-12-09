// src/components/ImageCarousel.jsx
import { useState } from 'react'
import { Carousel, Button } from 'react-bootstrap'

export default function ImageCarousel({ images, title }) {
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) return null

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  if (images.length === 1) {
    return (
      <div className="mb-4">
        <img
          src={images[0]}
          alt={title}
          className="img-fluid rounded"
          style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
        />
      </div>
    )
  }

  return (
    <div className="mb-4">
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
        {images.map((img, idx) => (
          <Carousel.Item key={idx}>
            <img
              src={img}
              alt={`${title} - Image ${idx + 1} of ${images.length}`}
              className="d-block w-100"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="text-center mt-2">
        <small className="text-muted">
          Image {index + 1} of {images.length}
        </small>
      </div>
    </div>
  )
}


