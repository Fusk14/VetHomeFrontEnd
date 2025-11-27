# Configuración de Microservicios

Este proyecto está conectado a microservicios backend. Sigue estas instrucciones para configurar las URLs.

## 📋 Microservicios Disponibles

- **Usuarios/Auth**: Puerto 8081
- **Mascotas**: Puerto 8090
- **Consultas**: Puerto 8091
- **Reseñas**: Puerto 8087
- **Notificaciones**: Puerto 8086
- **Inventario**: Puerto 8085

## 🔧 Configuración de URLs

### Opción 1: Usando Variables de Entorno (Recomendado)

1. Crea un archivo `.env` en la raíz del proyecto (copia `.env.example` si existe)
2. Agrega las URLs de tus microservicios:

```env
# Para desarrollo local
VITE_API_USUARIOS_URL=http://localhost:8081
VITE_API_MASCOTAS_URL=http://localhost:8090
VITE_API_CONSULTAS_URL=http://localhost:8091
VITE_API_RESENAS_URL=http://localhost:8087
VITE_API_NOTIFICACIONES_URL=http://localhost:8086
VITE_API_INVENTARIO_URL=http://localhost:8085
```

**Para Dev Tunnels (como en tu app móvil):**

```env
VITE_API_USUARIOS_URL=https://rvhcfwb0-8081.brs.devtunnels.ms
VITE_API_MASCOTAS_URL=https://rvhcfwb0-8090.brs.devtunnels.ms
VITE_API_CONSULTAS_URL=https://rvhcfwb0-8091.brs.devtunnels.ms
VITE_API_RESENAS_URL=https://rvhcfwb0-8087.brs.devtunnels.ms
VITE_API_NOTIFICACIONES_URL=https://rvhcfwb0-8086.brs.devtunnels.ms
VITE_API_INVENTARIO_URL=https://rvhcfwb0-8085.brs.devtunnels.ms
```

3. Reinicia el servidor de desarrollo (`npm run dev`)

### Opción 2: Modificar directamente el archivo de configuración

Edita `src/config/api.config.ts` y cambia las URLs por defecto:

```typescript
export const API_CONFIG = {
  USUARIOS: 'https://rvhcfwb0-8081.brs.devtunnels.ms',
  MASCOTAS: 'https://rvhcfwb0-8090.brs.devtunnels.ms',
  // ... etc
}
```

## 🚀 Cómo obtener las URLs de Dev Tunnels

1. En VS Code, abre la paleta de comandos (Ctrl+Shift+P / Cmd+Shift+P)
2. Busca "Ports: Focus on Ports View"
3. Para cada microservicio que esté corriendo, verás una URL de dev tunnel
4. Copia esas URLs y úsalas en tu archivo `.env`

## 📝 Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/rut/{rut}` - Obtener usuario por RUT
- `GET /api/usuarios/correo/{correo}` - Obtener usuario por correo
- `POST /api/usuarios` - Crear usuario

### Mascotas
- `GET /api/mascotas` - Obtener todas las mascotas
- `GET /api/mascotas/{id}` - Obtener mascota por ID
- `POST /api/mascotas` - Crear mascota
- `DELETE /api/mascotas/{id}` - Eliminar mascota

### Consultas
- `GET /api/consultas` - Obtener todas las consultas
- `GET /api/consultas/{id}` - Obtener consulta por ID
- `POST /api/consultas` - Crear consulta
- `DELETE /api/consultas/{id}` - Eliminar consulta

### Reseñas
- `GET /api/resenas` - Obtener todas las reseñas
- `POST /api/resenas` - Crear reseña

### Notificaciones
- `GET /api/notificaciones` - Obtener todas las notificaciones
- `GET /api/notificaciones/{id}` - Obtener notificación por ID
- `GET /api/notificaciones/usuario/{idUsuario}` - Obtener notificaciones por usuario
- `POST /api/notificaciones` - Crear notificación
- `DELETE /api/notificaciones/{id}` - Eliminar notificación

### Inventario
- `GET /api/medicamentos` - Obtener todos los medicamentos
- `POST /api/medicamentos` - Crear medicamento

## 🔍 Verificación

Para verificar que la conexión funciona:

1. Asegúrate de que los microservicios estén corriendo
2. Abre la consola del navegador (F12)
3. Intenta hacer login o registro
4. Revisa si hay errores de conexión en la consola

## ⚠️ Notas Importantes

- Las variables de entorno deben comenzar con `VITE_` para que Vite las exponga
- Después de cambiar las variables de entorno, **debes reiniciar el servidor de desarrollo**
- El archivo `.env` no debe subirse a Git (ya está en `.gitignore`)
- Si usas dev tunnels, las URLs cambian cada vez que reinicias el túnel

## 🐛 Solución de Problemas

**Error: "Failed to fetch" o "Network error"**
- Verifica que los microservicios estén corriendo
- Verifica que las URLs en `.env` sean correctas
- Verifica que no haya problemas de CORS (los microservicios deben tener `@CrossOrigin`)

**Error: "401 Unauthorized"**
- Verifica que las credenciales sean correctas
- Verifica que el usuario exista en la base de datos

**Las URLs no se actualizan**
- Reinicia el servidor de desarrollo (`npm run dev`)
- Limpia la caché del navegador


