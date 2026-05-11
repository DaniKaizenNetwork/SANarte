# Propuestas Arquitectónicas ADR
**Proyecto:** Plataforma Web de Artesanías con Microservicios

---

## ADR 001: Uso de Arquitectura basada en Microservicios
**Estado:** Aceptado  
**Fecha:** 10 de mayo de 2026

### Contexto
El proyecto consiste en desarrollar una plataforma web para exhibir artesanías y permitir que los clientes contacten directamente al vendedor mediante WhatsApp. Se requiere una arquitectura que permita separar responsabilidades entre administración, visualización pública y comunicación entre servicios, manteniendo el sistema organizado y fácil de mantener.

El equipo evaluó dos enfoques:
1. Arquitectura Monolítica
2. Arquitectura basada en Microservicios

### Decisión
Se decidió implementar una arquitectura basada en microservicios. Los servicios definidos serán:
* API Gateway
* Servicio de administración de productos
* Servicio público de consulta de productos
* Frontend administrador
* Frontend usuario

### Justificación
* **Separación de responsabilidades:** Cada servicio tendrá una responsabilidad específica, facilitando mantenimiento y escalabilidad.
* **Despliegue independiente:** Cada componente puede desplegarse y actualizarse sin afectar el resto del sistema.
* **Escalabilidad:** Los servicios más utilizados podrán escalarse individualmente.
* **Aprendizaje académico:** Permite aplicar conceptos modernos de ingeniería de software y sistemas distribuidos.

### Consecuencias
* **Positivas:** Mayor modularidad, mejor organización del código, facilidad para mantenimiento futuro y separación clara entre frontend y backend.
* **Negativas:** Mayor complejidad inicial, necesidad de configurar comunicación entre servicios y mayor consumo de recursos respecto a un monolito.

---

## ADR 002: Uso de Spring Boot como Framework Backend
**Estado:** Aceptado  
**Fecha:** 10 de mayo de 2026

### Contexto
Se requiere desarrollar APIs REST para la gestión y consulta de artesanías. El equipo evaluó:
* Node.js con Express
* Django
* Spring Boot

### Decisión
Se decidió utilizar **Spring Boot con Java 17** para los microservicios backend.

### Justificación
* **Integración con Java:** El equipo posee conocimientos previos en Java y programación orientada a objetos.
* **Desarrollo rápido:** Spring Boot reduce la configuración manual y facilita la creación de APIs REST.
* **Ecosistema robusto:** Incluye herramientas integradas para seguridad, persistencia, inyección de dependencias y validaciones.
* **Compatibilidad:** Se integra fácilmente con Spring Cloud Gateway, Docker y PostgreSQL.

### Consecuencias
* **Positivas:** Desarrollo backend más rápido, arquitectura organizada y amplia documentación.
* **Negativas:** Mayor consumo de memoria comparado con frameworks más ligeros y curva de aprendizaje inicial.

---

## ADR 003: Uso de Angular para el Frontend
**Estado:** Aceptado  
**Fecha:** 10 de mayo de 2026

### Contexto
Se necesita desarrollar dos interfaces web: Panel administrador y Catálogo público de artesanías. Se evaluaron React, Vue y Angular.

### Decisión
Se decidió utilizar **Angular** como framework frontend.

### Justificación
* **Arquitectura estructurada:** Proporciona una estructura modular adecuada para proyectos escalables.
* **Componentización:** Facilita reutilización de componentes visuales.
* **Integración HTTP:** Incluye herramientas integradas para consumir APIs REST.
* **TypeScript:** Permite un desarrollo más seguro y mantenible.

### Consecuencias
* **Positivas:** Código organizado, mejor mantenibilidad y separación clara entre vistas y lógica.
* **Negativas:** Framework más pesado y mayor complejidad inicial.

---

## ADR 004: Uso de PostgreSQL como Base de Datos
**Estado:** Aceptado  
**Fecha:** 10 de mayo de 2026

### Contexto
El sistema necesita almacenar productos, categorías e información administrativa. Se evaluaron MongoDB, MySQL y PostgreSQL.

### Decisión
Se decidió utilizar **PostgreSQL** como base de datos principal.

### Justificación
* **Integridad de datos:** Permite mantener relaciones consistentes mediante llaves foráneas.
* **Estabilidad:** Es una base de datos madura y ampliamente utilizada.
* **Compatibilidad:** Integración nativa con Spring Boot y Docker.
* **Escalabilidad académica:** Permite implementar consultas SQL complejas.

### Consecuencias
* **Positivas:** Mayor consistencia de datos, buen rendimiento y seguridad transaccional.
* **Negativas:** Requiere esquemas estructurados y los cambios en tablas requieren migraciones.

---

## ADR 005: Uso de Docker para Contenerización
**Estado:** Aceptado  
**Fecha:** 10 de mayo de 2026

### Contexto
El proyecto tendrá múltiples servicios independientes. Se necesita simplificar el despliegue, la configuración y la ejecución local.

### Decisión
Se decidió utilizar **Docker y Docker Compose** para contenerizar todos los servicios.

### Justificación
* **Portabilidad:** Permite ejecutar el proyecto en cualquier entorno sin conflictos de dependencias.
* **Facilidad de despliegue:** Todos los servicios pueden iniciarse mediante un único comando.
* **Aislamiento:** Cada servicio funciona en su propio contenedor.
* **Buenas prácticas DevOps:** Facilita administración y despliegue del sistema.

### Consecuencias
* **Positivas:** Configuración uniforme, fácil despliegue y mejor organización del entorno.
* **Negativas:** Consumo adicional de recursos y complejidad inicial en configuración.

---

## ADR 006: Uso de API Gateway para Centralizar Acceso
**Estado:** Aceptado  
**Fecha:** 10 de mayo de 2026

### Contexto
El sistema cuenta con múltiples microservicios backend. Se requiere centralizar rutas, mejorar la seguridad y simplificar el acceso desde el frontend.

### Decisión
Se decidió implementar un **API Gateway usando Spring Cloud Gateway**.

### Justificación
* **Punto único de entrada:** Los clientes accederán mediante una sola URL.
* **Seguridad centralizada:** Gestión de autenticación y validaciones desde un solo punto.
* **Encapsulamiento:** Oculta la estructura interna de microservicios.
* **Escalabilidad:** Facilita agregar nuevos servicios en el futuro.

### Consecuencias
* **Positivas:** Arquitectura más limpia, mejor control de tráfico y mayor seguridad.
* **Negativas:** Nuevo componente a mantener y posible punto único de falla.

---

## ADR 007: Separación entre Servicio Público y Servicio Administrativo
**Estado:** Aceptado  
**Fecha:** 10 de mayo de 2026

### Contexto
El sistema necesita diferenciar operaciones administrativas de las consultas públicas.

### Decisión
Se decidió separar el backend en dos microservicios: **Servicio administrativo (CRUD)** y **Servicio público (solo lectura)**.

### Justificación
* **Seguridad:** Los usuarios públicos no tendrán acceso a operaciones sensibles.
* **Escalabilidad:** Las consultas públicas pueden escalar independientemente.
* **Organización:** Cada servicio tendrá responsabilidades específicas.

### Consecuencias
* **Positivas:** Mayor seguridad, arquitectura más clara y mejor rendimiento en consultas.
* **Negativas:** Duplicación parcial de lógica y mayor comunicación entre servicios.

## Stack Tecnológico Final

| Tecnología | Uso |
| :--- | :--- |
| **Java 17** | Lenguaje Backend |
| **Spring Boot** | Framework de Microservicios |
| **Spring Data JPA** | Persistencia de datos |
| **Angular** | Framework Frontend |
| **PostgreSQL** | Base de Datos Relacional |
| **Docker** | Contenerización |
| **Docker Compose** | Orquestación de contenedores |
| **Spring Cloud Gateway** | API Gateway |

## trello

https://trello.com/invite/b/68e54546090f3526163a7063/ATTIdf1fc6256f3632551101c52cb505313332EA81A6/sanarte