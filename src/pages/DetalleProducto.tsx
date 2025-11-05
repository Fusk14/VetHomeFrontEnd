import React from 'react'

export default function DetalleProducto() {
  return (
    <section className="main-article">
      <h1 className="main-title">Detalle del Producto</h1>
      <div className="card">
        <img src="/assets/img/pedigree.png" alt="Pedigree saco 5kg" style={{ width: 200, borderRadius: 8 }} />
        <h2 className="section-title">Pedigree saco 5kg</h2>
        <p className="main-text">Alimento balanceado para perros adultos. Precio: $9.990</p>
        <button className="btn-custom">Agregar al carrito</button>
      </div>
    </section>
  )
}
