# SANarte
Proyecto SAN Arte, amor convertido en arte.

#  Marketplace de Artesanías — Arquitectura de Microservicios

Plataforma web desarrollada bajo arquitectura de microservicios para la publicación y administración de artesanías, permitiendo a los usuarios visualizar productos y contactar directamente al vendedor mediante WhatsApp.

---

#  Descripción del Proyecto

El sistema permite:

- Visualizar artesanías disponibles.
- Consultar detalles de productos.
- Filtrar por categorías.
- Gestionar productos desde un panel administrativo.
- Redireccionar usuarios a WhatsApp para contacto directo.

La solución implementa una arquitectura desacoplada basada en microservicios utilizando tecnologías modernas y contenedorización con Docker.

---

#  Arquitectura del Proyecto

La plataforma está compuesta por 5 microservicios principales:

| Microservicio | Tecnología | Responsabilidad |
|---|---|---|
| API Gateway | Spring Cloud Gateway | Punto central de acceso |
| Admin Products Service | Spring Boot | CRUD administrativo |
| Public Products Service | Spring Boot | Consultas públicas |
| Frontend Usuario | Angular | Catálogo público |
| Frontend Admin | Angular | Panel administrativo |

---

#  Arquitectura General

```text
                    ┌──────────────────────┐
                    │  FRONTEND USUARIO   │
                    │      Angular        │
                    └──────────┬──────────┘
                               │
                               ▼
                      ┌────────────────┐
                      │  API GATEWAY   │
                      │ Spring Gateway │
                      └───────┬────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼

      ┌──────────────────┐        ┌──────────────────┐
      │ PUBLIC PRODUCTS  │        │ ADMIN PRODUCTS   │
      │     SERVICE      │        │     SERVICE      │
      │   SOLO LECTURA   │        │   CRUD COMPLETO  │
      └────────┬─────────┘        └────────┬─────────┘
               │                           │
               └──────────┬────────────────┘
                          ▼

                 ┌──────────────────┐
                 │    POSTGRESQL    │
                 │ categoria        │
                 │ producto         │
                 └──────────────────┘
---

#  Tecnologías Utilizadas

## Backend
- Java 17
- Spring Boot 3
- Spring Data JPA
- Spring Security
- JWT
- Spring Cloud Gateway

## Frontend
- Angular 17+

## Base de Datos
- PostgreSQL

## DevOps
- Docker
- Docker Compose

---

#  Estructura del Proyecto

```text
project-root/
│
├── gateway-service/
├── admin-products-service/
├── public-products-service/
├── frontend-user/
├── frontend-admin/
├── database/
└── docker-compose.yml
```

---

#  Modelo Entidad Relación (MER)

## Tabla: categoria

| Campo | Tipo | Restricción |
|---|---|---|
| id_categoria | BIGSERIAL | PK |
| nombre | VARCHAR(100) | NOT NULL |
| descripcion | TEXT | NULL |

---

## Tabla: producto

| Campo | Tipo | Restricción |
|---|---|---|
| id_producto | BIGSERIAL | PK |
| nombre | VARCHAR(150) | NOT NULL |
| detalle | TEXT | NOT NULL |
| precio | NUMERIC(10,2) | NOT NULL |
| imagen_url | TEXT | NULL |
| estado | VARCHAR(20) | NOT NULL |
| id_categoria | BIGINT | FK |

---

#  Relación

```text
CATEGORIA (1) ─────────── (N) PRODUCTO
```

---

#  UML Profesional

```text
┌────────────────────────────┐
│         Categoria          │
├────────────────────────────┤
│ - idCategoria : Long       │
│ - nombre : String          │
│ - descripcion : String     │
├────────────────────────────┤
│ + getIdCategoria()         │
│ + setIdCategoria()         │
│ + getNombre()              │
│ + setNombre()              │
│ + getDescripcion()         │
│ + setDescripcion()         │
│ + toString()               │
└──────────────┬─────────────┘
               │ 1
               │
               │
               │ N
┌──────────────▼─────────────┐
│          Producto          │
├────────────────────────────┤
│ - idProducto : Long        │
│ - nombre : String          │
│ - detalle : String         │
│ - precio : Double          │
│ - imagenUrl : String       │
│ - estado : EstadoProducto  │
│ - categoria : Categoria    │
├────────────────────────────┤
│ + getIdProducto()          │
│ + setIdProducto()          │
│ + getNombre()              │
│ + setNombre()              │
│ + getDetalle()             │
│ + setDetalle()             │
│ + getPrecio()              │
│ + setPrecio()              │
│ + getImagenUrl()           │
│ + setImagenUrl()           │
│ + getEstado()              │
│ + setEstado()              │
│ + getCategoria()           │
│ + setCategoria()           │
│ + toString()               │
└────────────────────────────┘
```

---

# 🧠 Decisiones Arquitectónicas

## Arquitectura basada en microservicios

Se implementó una arquitectura desacoplada para:

- Mejorar mantenibilidad.
- Facilitar escalabilidad.
- Separar responsabilidades.
- Aislar operaciones críticas.

---

## Separación lectura/escritura

El sistema divide:

- Operaciones públicas de lectura.
- Operaciones administrativas de escritura.

### Beneficios

- Mayor seguridad.
- Mejor rendimiento.
- Menor acoplamiento.
- Escalabilidad futura.

---

## API Gateway

El API Gateway centraliza:

- Enrutamiento.
- Acceso a servicios.
- Ocultamiento de microservicios internos.

---

## PostgreSQL

Se eligió PostgreSQL por:

- Robustez relacional.
- Compatibilidad con Spring Boot.
- Estabilidad.
- Facilidad de integración.

---

## Docker

Docker permite:

- Contenedorización.
- Portabilidad.
- Consistencia entre entornos.
- Despliegue simplificado.

---

#  Seguridad

La autenticación se implementa únicamente en:

- Frontend Admin
- Admin Products Service

Se utiliza:

- Spring Security

El catálogo público no requiere autenticación.

---

# 📡 Endpoints Principales

## Productos

```http
GET    /productos
GET    /productos/{id}
POST   /productos
PUT    /productos/{id}
DELETE /productos/{id}
```

---

## Categorías

```http
GET    /categorias
POST   /categorias
PUT    /categorias/{id}
DELETE /categorias/{id}
```

---

#  Integración WhatsApp

La plataforma permite contactar directamente al vendedor mediante:

```text
https://wa.me/57NUMERO?text=Hola%20quiero%20información%20sobre%20el%20producto
```

---

#  Docker Compose

```yaml
services:

  postgres:
    image: postgres:16

  gateway-service:
    build: ./gateway-service

  admin-products-service:
    build: ./admin-products-service

  public-products-service:
    build: ./public-products-service

  frontend-user:
    build: ./frontend-user

  frontend-admin:
    build: ./frontend-admin
```

---

#  Ejecución del Proyecto

## Clonar repositorio

```bash
git clone <url-repositorio>
```

---

## Levantar servicios

```bash
docker compose up --build
```

---

#  Funcionalidades

## Usuario Cliente

- Ver catálogo.
- Consultar detalles.
- Filtrar productos.
- Visualizar imágenes.
- Contactar por WhatsApp.

---

## Administrador

- Crear productos.
- Editar productos.
- Eliminar productos.
- Gestionar categorías.
- Administrar catálogo.

---

#  Story Map

## Usuario Cliente

- Explorar catálogo.
- Filtrar productos.
- Ver detalles.
- Contactar vendedor.

---

## Usuario Administrador

- Gestionar productos.
- Gestionar categorías.
- Administrar catálogo.

---

#  Objetivos del Proyecto

- Implementar arquitectura de microservicios.
- Aplicar buenas prácticas de desarrollo.
- Desacoplar frontend y backend.
- Utilizar Docker para despliegue.
- Implementar persistencia relacional.
  
---

#  Principios Aplicados

- Arquitectura REST.
- Separación de responsabilidades.
- Desacoplamiento.
- Escalabilidad.
- Mantenibilidad.
- Contenedorización.

---

#  Autor
Daniela SM.
Proyecto desarrollado como solución académica para implementación de arquitectura basada en microservicios utilizando Spring Boot, Angular, PostgreSQL y Docker.

---
