import { useState, useEffect } from 'react'
import { Usuario, Producto, Contacto, AdminStats } from '../types/admin'

export const useAdminData = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)

  // Adaptar datos de usuarios existentes
  const adaptUsersData = (usersData: any[]): Usuario[] => {
    return usersData.map(user => ({
      id: user.id || `user-${Date.now()}-${Math.random()}`,
      nombre: user.nombre || '',
      correo: user.correo || '',
      telefono: user.telefono || '',
      rol: user.rol || 'cliente',
      fechaRegistro: user.fechaRegistro || new Date().toISOString()
    }))
  }

  const getDefaultProducts = (): Producto[] => [
    { id: '1', producto: 'Pedigree saco 5kg', imagen: '/assets/img/pedigree.png', precio: 9990, stock: 50, categoria: 'alimento', activo: true },
    { id: '2', producto: 'Juguete para gato', imagen: '/assets/img/juguetegato.jpg', precio: 3000, stock: 25, categoria: 'juguete', activo: true },
    { id: '3', producto: 'Collar para mascota', imagen: '/assets/img/collar.jpg', precio: 2500, stock: 30, categoria: 'accesorio', activo: true },
    { id: '4', producto: 'Cama para perro', imagen: '/assets/img/camaperro.jpg', precio: 15000, stock: 15, categoria: 'cama', activo: true }
  ]

  useEffect(() => {
    const loadInitialData = () => {
      try {
        const usuariosData = adaptUsersData(JSON.parse(localStorage.getItem('usuarios') || '[]'))
        const productosData = JSON.parse(localStorage.getItem('productos') || '[]')
        const contactosData = JSON.parse(localStorage.getItem('contactos') || '[]')

        setUsuarios(usuariosData)
        setProductos(productosData.length > 0 ? productosData : getDefaultProducts())
        setContactos(contactosData)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Sincronizar con localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('usuarios', JSON.stringify(usuarios))
    }
  }, [usuarios, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('productos', JSON.stringify(productos))
    }
  }, [productos, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('contactos', JSON.stringify(contactos))
    }
  }, [contactos, loading])

  // Estadísticas
  const estadisticas: AdminStats = {
    totalUsuarios: usuarios.length,
    totalAdmins: usuarios.filter(u => u.rol === 'admin').length,
    totalProductos: productos.length,
    totalContactos: contactos.length,
    contactosNoLeidos: contactos.filter(c => !c.leido).length,
    productosBajoStock: productos.filter(p => p.stock < 10).length
  }

  // Operaciones
  const cambiarRolUsuario = (usuarioId: string, nuevoRol: 'cliente' | 'admin') => {
    setUsuarios(prev => prev.map(usuario =>
      usuario.id === usuarioId ? { ...usuario, rol: nuevoRol } : usuario
    ))
  }

  const eliminarUsuario = (usuarioId: string) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== usuarioId))
  }

  const agregarProducto = (producto: Omit<Producto, 'id'>) => {
    const nuevoProducto: Producto = {
      ...producto,
      id: Date.now().toString()
    }
    setProductos(prev => [...prev, nuevoProducto])
  }

  const actualizarProducto = (productoId: string, productoActualizado: Omit<Producto, 'id'>) => {
    setProductos(prev => prev.map(p =>
      p.id === productoId ? { ...productoActualizado, id: productoId } : p
    ))
  }

  const eliminarProducto = (productoId: string) => {
    setProductos(prev => prev.filter(producto => producto.id !== productoId))
  }

  const marcarContactoLeido = (contactoId: string) => {
    setContactos(prev => prev.map(contacto =>
      contacto.id === contactoId ? { ...contacto, leido: true } : contacto
    ))
  }

  const eliminarContacto = (contactoId: string) => {
    setContactos(prev => prev.filter(contacto => contacto.id !== contactoId))
  }

  return {
    usuarios,
    productos,
    contactos,
    estadisticas,
    loading,
    cambiarRolUsuario,
    eliminarUsuario,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    marcarContactoLeido,
    eliminarContacto
  }
}