/**
 * Configuración de URLs base para los microservicios
 * 
 * Para desarrollo local, usa localhost:
 * - Usuarios: http://localhost:8081
 * 
 * Para dev tunnels (como en tu app móvil), usa las URLs que te da VS Code:
 * - Usuarios: https://rvhcfwb0-8081.brs.devtunnels.ms
 * 
 * IMPORTANTE: Actualiza estas URLs según los dev tunnels que tengas activos
 */

export const API_CONFIG = {
  // Microservicio de Usuarios y Autenticación
  USUARIOS: import.meta.env.VITE_API_USUARIOS_URL || 'http://localhost:8081',
  
  // Microservicio de Mascotas
  MASCOTAS: import.meta.env.VITE_API_MASCOTAS_URL || 'http://localhost:8090',
  
  // Microservicio de Consultas
  CONSULTAS: import.meta.env.VITE_API_CONSULTAS_URL || 'http://localhost:8091',
  
  // Microservicio de Reseñas
  RESENAS: import.meta.env.VITE_API_RESENAS_URL || 'http://localhost:8087',
  
  // Microservicio de Notificaciones
  NOTIFICACIONES: import.meta.env.VITE_API_NOTIFICACIONES_URL || 'http://localhost:8086',
  
  // Microservicio de Inventario
  INVENTARIO: import.meta.env.VITE_API_INVENTARIO_URL || 'http://localhost:8085',
} as const

/**
 * Construye la URL completa para un endpoint
 * @param baseUrl - URL base del microservicio
 * @param path - Ruta del endpoint (ej: '/api/usuarios')
 * @returns URL completa
 */
export const buildApiUrl = (baseUrl: string, path: string): string => {
  // Asegurar que el path comience con /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  // Remover / al final de la baseUrl si existe
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return `${normalizedBase}${normalizedPath}`
}


