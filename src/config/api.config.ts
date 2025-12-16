export const API_CONFIG = {
  // Microservicio de Usuarios y Autenticación
  USUARIOS: import.meta.env.VITE_API_USUARIOS_URL || 'https://5r3hf9wp-8081.brs.devtunnels.ms',
  
  // Microservicio de Mascotas
  MASCOTAS: import.meta.env.VITE_API_MASCOTAS_URL || 'https://5r3hf9wp-8090.brs.devtunnels.ms',
  
  // Microservicio de Consultas
  CONSULTAS: import.meta.env.VITE_API_CONSULTAS_URL || 'https://5r3hf9wp-8091.brs.devtunnels.ms',
  
  // Microservicio de Reseñas
  RESENAS: import.meta.env.VITE_API_RESENAS_URL || 'https://5r3hf9wp-8086.brs.devtunnels.ms',
  
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



