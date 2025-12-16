import React from 'react'

export default function Home() {
  return (
    <section className="main-article home-article">
      <h1 className="main-title">Bienvenido a la Veterinaria</h1>
      <p className="main-text">¡Esta veterinaria esta enfocada en brindarte el mejor servicio posible a ti y a tus mascotas!</p>
      <div className="home-hero">
        <img src="/assets/img/clinica-veterinaria.jpg" alt="Clínica veterinaria" width={700} />
      </div>
    </section>
  )
}

