/**
 * Cliente API base para hacer peticiones HTTP a los microservicios
 */

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

/**
 * Opciones para las peticiones HTTP
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  requiresAuth?: boolean
}

/**
 * Realiza una petición HTTP al microservicio
 * @param url - URL completa del endpoint
 * @param options - Opciones de la petición
 * @returns Respuesta parseada como JSON
 */
export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    requiresAuth = false,
  } = options

  // Headers por defecto
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Agregar token de autenticación si es necesario
  if (requiresAuth) {
    const authUser = localStorage.getItem('auth_user')
    if (authUser) {
      try {
        const user = JSON.parse(authUser)
        // Si el backend requiere un token JWT, aquí lo agregarías
        // defaultHeaders['Authorization'] = `Bearer ${user.token}`
      } catch (error) {
        console.error('Error parsing auth_user:', error)
      }
    }
  }

  // Combinar headers
  const finalHeaders = { ...defaultHeaders, ...headers }

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    // Intentar parsear la respuesta como JSON
    let data: T | undefined
    const text = await response.text()
    
    if (text) {
      try {
        data = JSON.parse(text) as T
      } catch {
        // Si no es JSON, usar el texto como error
        data = text as unknown as T
      }
    }

    // Si la respuesta no es exitosa, retornar error
    if (!response.ok) {
      return {
        error: typeof data === 'string' ? data : `Error ${response.status}: ${response.statusText}`,
        status: response.status,
      }
    }

    return {
      data,
      status: response.status,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Error de conexión',
      status: 0,
    }
  }
}

/**
 * Helper para peticiones GET
 */
export async function apiGet<T>(url: string, requiresAuth = false): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'GET', requiresAuth })
}

/**
 * Helper para peticiones POST
 */
export async function apiPost<T>(
  url: string,
  body: any,
  requiresAuth = false
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'POST', body, requiresAuth })
}

/**
 * Helper para peticiones PUT
 */
export async function apiPut<T>(
  url: string,
  body: any,
  requiresAuth = false
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'PUT', body, requiresAuth })
}

/**
 * Helper para peticiones DELETE
 */
export async function apiDelete<T>(url: string, requiresAuth = false): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'DELETE', requiresAuth })
}


