import React from 'react'
import { Link } from 'react-router-dom'

export default function Blogs() {
  return (
    <section className="main-article blogs-section">
      <h1 className="main-title">Noticias y Consejos</h1>
      <div className="blogs-list">
        <article className="blog-card">
          <img src="/assets/img/juguetegato.jpg" alt="Juguete para gato" className="blog-card-img" />
          <h2 className="section-title"><Link to="/blogs/1" className="blog-card-link">¿Por qué los gatos necesitan juguetes?</Link></h2>
          <p className="main-text">Descubre la importancia de los juguetes en la vida de tu gato.</p>
        </article>
        <article className="blog-card">
          <img src="/assets/img/camaperro.jpg" alt="Cama para perro" className="blog-card-img" />
          <h2 className="section-title"><Link to="/blogs/2" className="blog-card-link">El mejor descanso para tu perro</Link></h2>
          <p className="main-text">Consejos para elegir la cama ideal para tu mascota.</p>
        </article>
      </div>
    </section>
  )
}
