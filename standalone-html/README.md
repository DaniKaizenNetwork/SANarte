# SANarte - Tienda de Artesanías

Aplicación web frontend en HTML/CSS/JavaScript puro que se conecta a un backend Spring Boot.

## Estructura de Archivos

- `index.html` - Página principal con categorías
- `catalogo.html` - Página de catálogo de productos
- `producto.html` - Página de detalle de producto
- `styles.css` - Estilos CSS compartidos
- `script.js` - Funciones JavaScript compartidas
- `producto.js` - JavaScript específico para la página de producto
- `catalogo.js` - JavaScript específico para el catálogo

## Configuración

### Backend API

El frontend está configurado para conectarse a:
```
http://localhost:8080/api/public
```

Si tu backend está en otra URL, modifica la constante `API_BASE_URL` en `script.js`:

```javascript
const API_BASE_URL = 'http://tu-servidor:puerto/api/public';
```

### Endpoints Utilizados

1. **GET /productos** - Obtiene todos los productos
2. **GET /productos/{id}** - Obtiene un producto por ID
3. **GET /productos/categoria/{categoriaId}** - Filtra productos por categoría

## Estructura de Datos Esperada

El código está diseñado para trabajar con productos que tengan esta estructura (ajusta según tu API):

```json
{
  "id": 1,
  "nombre": "Jarrón Terracota 'Amanecer'",
  "descripcion": "Una pieza única que encarna la esencia de la alfarería ancestral...",
  "precio": 285.00,
  "categoriaId": 1,
  "stock": 1,
  "materiales": "Arcilla roja de origen local, Esmalte mate transparente",
  "dimensiones": "45cm Alto x 20cm Diámetro",
  "imagenPrincipal": "url-de-imagen",
  "imagenes": ["url-imagen-1", "url-imagen-2", "url-imagen-3"]
}
```

### Campos Alternativos Soportados

El código también soporta nombres de campos en inglés:
- `name` en lugar de `nombre`
- `description` en lugar de `descripcion`
- `price` en lugar de `precio`
- `image` en lugar de `imagenPrincipal`
- `images` en lugar de `imagenes`
- etc.

## Personalización

### Categorías

Las categorías están mapeadas en `script.js` en el objeto `CATEGORY_MAP`. Puedes modificar:

```javascript
const CATEGORY_MAP = {
    1: {
        name: 'Artesanal',
        description: 'Descripción de la categoría',
        badge: 'VER MÁS',
        class: 'large',
        image: 'url-de-imagen'
    },
    // ... más categorías
};
```

### Imágenes

Si tu API no devuelve URLs de imágenes, el código usa imágenes de placeholder de Unsplash. Para usar tus propias imágenes:

1. Actualiza los campos `imagen` o `imagenPrincipal` en tu API
2. O modifica las funciones `updateProductImages()` y `createProductCard()` para usar tus URLs

## Uso

1. Asegúrate de que tu backend Spring Boot está ejecutándose en `http://localhost:8080`
2. Abre `index.html` en tu navegador
3. Navega entre las páginas:
   - **Index** → Ver categorías
   - **Catálogo** → Ver todos los productos o filtrados por categoría
   - **Producto** → Ver detalles de un producto específico

## CORS

Si encuentras problemas de CORS, asegúrate de que tu backend Spring Boot tenga configurado:

```java
@CrossOrigin(origins = "*")
```

O configura CORS globalmente en tu aplicación Spring Boot.

## Navegación

- Clic en una categoría → Redirige a `catalogo.html?categoria={id}`
- Clic en un producto → Redirige a `producto.html?id={id}`
- Los productos relacionados se cargan automáticamente de la misma categoría

## Responsive Design

El diseño es responsive y se adapta a:
- Desktop (1440px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## Fuentes

El proyecto usa Google Fonts:
- **Playfair Display** - Títulos y encabezados
- **Montserrat** - Texto del cuerpo

Las fuentes se cargan automáticamente desde Google Fonts CDN.
