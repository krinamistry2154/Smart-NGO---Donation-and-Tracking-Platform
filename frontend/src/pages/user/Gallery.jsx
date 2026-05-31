import React from 'react'

function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  ]

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5">Gallery</h2>

      <div className="row">
        {images.map((img, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card shadow-sm">
              <img src={img} alt="gallery" className="gallery-img" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery