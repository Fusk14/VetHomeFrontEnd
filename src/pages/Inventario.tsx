import React, { useState, useEffect } from 'react'

type Producto = {
  producto: string
  imagen: string
  precio: number
}

export default function Inventario() {
  const productos: Producto[] = [
    { producto: 'Pedigree saco 5kg', imagen: '/assets/img/pedigree.png', precio: 9990 },
    { producto: 'Juguete para gato', imagen: '/assets/img/juguetegato.jpg', precio: 3000 },
    { producto: 'Collar para mascota', imagen: '/assets/img/collar.jpg', precio: 2500 },
    { producto: 'Cama para perro', imagen: '/assets/img/camaperro.jpg', precio: 15000 }
  ]

  const [carro, setCarro] = useState<any[]>([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('carro') || '[]')
    setCarro(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('carro', JSON.stringify(carro))
  }, [carro])

  function agregarAlCarro(item: Producto, cantidad: number) {
    const existente = carro.find(c => c.producto === item.producto)
    if (existente) {
      existente.cantidad += cantidad
      setCarro([...carro])
    } else {
      setCarro([...carro, { ...item, cantidad }])
    }
  }

  function vaciarCarro() {
    if (confirm('¿Vaciar carro?')) setCarro([])
  }

  function realizarOrden() {
    if (carro.length === 0) { alert('Tu carrito está vacío.'); return }
    alert('Orden generada. Gracias por tu compra')
    setCarro([])
  }

  const total = carro.reduce((s, it) => s + it.precio * it.cantidad, 0)

  return (
    <section className="main-article">
      <h1 className="main-title">Productos</h1>
      <div className="row">
        <div id="listaProductos" className="col-md-8">
          <div className="d-flex flex-wrap" style={{ gap: 16 }}>
            {productos.map((p, i) => (
              <div key={i} style={{ width: 220 }} className="card p-2">
                <img src={p.imagen} alt={p.producto} style={{ width: '100%', borderRadius: 8 }} />
                <h4>{p.producto}</h4>
                <p>Precio: ${p.precio.toLocaleString()}</p>
                <input type="number" defaultValue={1} min={1} id={`cantidad-${i}`} />
                <button className="btn-custom" onClick={() => {
                  const cantidad = parseInt((document.getElementById(`cantidad-${i}`) as HTMLInputElement).value) || 1
                  agregarAlCarro(p, cantidad)
                }}>Agregar al carrito</button>
              </div>
            ))}
          </div>
        </div>
        <aside className="col-md-4">
          <h3>Carrito</h3>
          <ul id="listaCarro">
            {carro.length === 0 && <li className="list-group-item">Carrito vacío</li>}
            {carro.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.producto} x{item.cantidad}</span>
                <strong>${(item.precio * item.cantidad).toLocaleString()}</strong>
              </li>
            ))}
          </ul>
          <p>Total: <strong id="totalCarro">${total.toLocaleString()}</strong></p>
          <button className="btn-secondary-custom" id="vaciarCarro" onClick={vaciarCarro}>Vaciar carro</button>
          <button className="btn-custom" id="realizarOrden" onClick={realizarOrden}>Realizar orden</button>
        </aside>
      </div>
    </section>
  )
}
