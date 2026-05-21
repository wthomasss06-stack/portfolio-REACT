import React from 'react'
import './icon-cloud.css'

export function IconCloud({ images = [] }) {
  return (
    <div className="icon-cloud" aria-hidden="true">
      {images.map((src, i) => {
        const left = (i * 37) % 82
        const top = (i * 57) % 60
        const size = 32 + (i % 4) * 8
        const delay = (i % 6) * 0.2
        return (
          <img
            key={i}
            src={src}
            alt=""
            className="icon-cloud-img"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
            onError={e => { e.target.style.opacity = '0.25' }}
          />
        )
      })}
    </div>
  )
}
