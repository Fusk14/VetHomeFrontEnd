# Veterinaria - Frontend (React + TypeScript, Vite + SWC)

Este directorio contiene la versión migrada a React + TypeScript usando Vite con el plugin SWC.

Requisitos previos
- Node.js (>= 18 recomendado) y npm.

Pasos para levantar la aplicación (Windows PowerShell):

1. Abrir terminal en `frontend/`:

```powershell
cd frontend
```

2. Instalar dependencias:

```powershell
npm install
```

3. Copiar las imágenes del proyecto original a la carpeta pública de la app (solo una vez). Ejecuta desde la raíz del repo:

```powershell
# Desde c:\Workspace\Proyecto_SitioWEB_FS2
Copy-Item -Path .\assets\img\* -Destination .\frontend\public\assets\img -Recurse -Force
```

Si prefieres, puedes mover manualmente la carpeta `assets/img` a `frontend/public/assets/img` usando el explorador de archivos.

4. Ejecutar en modo desarrollo:

```powershell
npm run dev
```

La app estará disponible típicamente en http://localhost:5173

Notas importantes
- He copiado los archivos CSS y JS necesarios a `frontend/public/assets/`. Debes copiar las imágenes (binarios) manualmente con el comando anterior o con el explorador.
- El código JS original que dependía de manipulación directa del DOM se ha dejado en `public/assets/js/` para facilitar la migración gradual. En pasos siguientes migraré esa lógica a módulos TS/React dentro de `src/`.
- Para producción, usa `npm run build`.

Siguientes pasos propuestos (en el repo):
- Copiar la carpeta de imágenes a `frontend/public/assets/img` (comando arriba).
- Migrar los scripts en `public/assets/js` a módulos TSX dentro de `src/`.
- Implementar AuthContext para manejo de sesión y roles.

Si quieres, procedo a copiar las imágenes y/o empezar a migrar `inventario.js` y `app.js` a TypeScript en `src/` ahora mismo.
