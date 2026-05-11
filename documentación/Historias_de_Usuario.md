# Historias de Usuario (HU)
**Proyecto:** Plataforma Web de SANarte

---

## Épica 1 — Gestión Administrativa de Productos

### HU-001 — Crear producto
**Historia de Usuario**
Como administrador, quiero registrar nuevas artesanías en el sistema, para mostrarlas posteriormente en el catálogo público.

#### Backend — Criterios de aceptación
* **CA-BE-001:** Dado un producto válido, cuando el administrador envíe la solicitud POST, entonces el sistema deberá guardar el producto en PostgreSQL.
* **CA-BE-002:** El sistema deberá validar: nombre obligatorio, precio obligatorio, categoría obligatoria, estado obligatorio.
* **CA-BE-003:** El endpoint deberá retornar: `{"mensaje": "Producto creado correctamente"}`.
* **CA-BE-004:** Si falta un campo obligatorio, el sistema devolverá: `400 BAD REQUEST`.
* **CA-BE-005:** La categoría enviada debe existir en la base de datos.

#### Frontend — Criterios de aceptación
* **CA-FE-001:** El formulario deberá permitir ingresar: nombre, detalle, precio, imagen URL, categoría y estado.
* **CA-FE-002:** El sistema deberá mostrar mensajes de validación si hay campos vacíos.
* **CA-FE-003:** Al guardar correctamente, el frontend mostrará: "Producto creado exitosamente".
* **CA-FE-004:** El formulario deberá limpiarse automáticamente tras registrar el producto.

---

### HU-002 — Consultar catálogo público
**Historia de Usuario**
Como cliente, quiero visualizar las artesanías disponibles, para conocer sus características y precios.

#### Backend — Criterios de aceptación
* **CA-BE-001:** El endpoint GET deberá retornar únicamente productos con `estado = DISPONIBLE`.
* **CA-BE-002:** El sistema deberá retornar: nombre, detalle, precio, imagen y categoría.
* **CA-BE-003:** La consulta deberá ser pública sin autenticación.
* **CA-BE-004:** El servicio deberá responder en formato JSON.

#### Frontend — Criterios de aceptación
* **CA-FE-001:** El catálogo deberá mostrar: imagen, nombre, precio y categoría.
* **CA-FE-002:** Cada producto deberá tener un botón: "Contactar por WhatsApp".
* **CA-FE-003:** Al hacer clic en WhatsApp, el sistema deberá abrir: `https://wa.me/[numero]` con un mensaje predefinido.
* **CA-FE-004:** La interfaz deberá ser responsive para móvil y escritorio.

---

### HU-003 — Editar producto
**Historia de Usuario**
Como administrador, quiero editar información de una artesanía, para mantener actualizado el catálogo.

#### Backend — Criterios de aceptación
* **CA-BE-001:** El endpoint PUT deberá actualizar el producto por ID.
* **CA-BE-002:** Si el producto no existe, el sistema devolverá: `404 NOT FOUND`.
* **CA-BE-003:** La actualización deberá persistirse en PostgreSQL.
* **CA-BE-004:** El sistema deberá validar tipos de datos correctos.

#### Frontend — Criterios de aceptación
* **CA-FE-001:** El administrador deberá visualizar un formulario precargado con los datos actuales.
* **CA-FE-002:** El sistema deberá mostrar confirmación de actualización exitosa.
* **CA-FE-003:** El formulario deberá permitir modificar todos los campos.
* **CA-FE-004:** La tabla de productos deberá actualizarse automáticamente.

---

### HU-004 — Eliminar producto
**Historia de Usuario**
Como administrador, quiero eliminar productos del catálogo, para retirar artesanías que ya no se venderán.

#### Backend — Criterios de aceptación
* **CA-BE-001:** El endpoint DELETE deberá eliminar el producto según su ID.
* **CA-BE-002:** Si el producto no existe, deberá retornar: `404 NOT FOUND`.
* **CA-BE-003:** La eliminación deberá reflejarse en la base de datos.

#### Frontend — Criterios de aceptación
* **CA-FE-001:** El sistema deberá solicitar confirmación antes de eliminar.
* **CA-FE-002:** El producto deberá desaparecer de la lista inmediatamente tras la confirmación.
* **CA-FE-003:** El sistema deberá mostrar un mensaje de eliminación exitosa.

---

### HU-005 — Filtrar productos por categoría
**Historia de Usuario**
Como cliente, quiero filtrar productos por categoría, para encontrar artesanías más fácilmente.

#### Backend — Criterios de aceptación
* **CA-BE-001:** El endpoint GET deberá permitir filtro por categoría (Ej: `/productos/categoria/1`).
* **CA-BE-002:** El sistema deberá retornar solo productos de la categoría seleccionada.
* **CA-BE-003:** La consulta deberá excluir productos agotados.

#### Frontend — Criterios de aceptación
* **CA-FE-001:** El catálogo deberá incluir un selector o lista de categorías.
* **CA-FE-002:** La lista de productos deberá actualizarse dinámicamente al seleccionar una categoría.
* **CA-FE-003:** El filtro deberá poder limpiarse para mostrar todos los productos nuevamente.

---

### HU-006 — Gestión de categorías
**Historia de Usuario**
Como administrador, quiero administrar categorías, para organizar correctamente las artesanías.

#### Backend — Criterios de aceptación
* **CA-BE-001:** El sistema deberá permitir: crear, listar, actualizar y eliminar categorías.
* **CA-BE-002:** No se podrá eliminar una categoría asociada a productos existentes.
* **CA-BE-003:** El sistema deberá validar nombres de categoría únicos.

#### Frontend — Criterios de aceptación
* **CA-FE-001:** El administrador deberá visualizar un listado de categorías.
* **CA-FE-002:** El sistema deberá mostrar formularios para crear y editar categorías.
* **CA-FE-003:** La interfaz deberá actualizar automáticamente la lista tras cualquier cambio.

---

### HU-007 — Visualizar detalle del producto
**Historia de Usuario**
Como cliente, quiero visualizar información detallada de una artesanía, para conocer mejor el producto antes de contactar al vendedor.

#### Backend — Criterios de aceptación
* **CA-BE-001:** El endpoint GET por ID deberá retornar toda la información detallada del producto.
* **CA-BE-002:** Si el producto no existe, deberá responder: `404 NOT FOUND`.

#### Frontend — Criterios de aceptación
* **CA-FE-001:** La vista detalle deberá mostrar: imagen, nombre, detalle, precio, categoría y estado.
* **CA-FE-002:** La página deberá incluir el botón de contacto directo por WhatsApp.

## trello

https://trello.com/invite/b/68e54546090f3526163a7063/ATTIdf1fc6256f3632551101c52cb505313332EA81A6/sanarte