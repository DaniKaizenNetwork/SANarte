# SANarte — Infraestructura AWS

---

## Tabla de contenido

1. [Visión general](#1-visión-general)
2. [Servicios AWS utilizados](#2-servicios-aws-utilizados)
3. [Arquitectura desplegada](#3-arquitectura-desplegada)
4. [Recursos activos](#4-recursos-activos)
5. [Prerrequisitos](#5-prerrequisitos)
6. [Despliegue desde cero](#6-despliegue-desde-cero)
   - 6.1 [Crear el stack de CloudFormation](#61-crear-el-stack-de-cloudformation)
   - 6.2 [Construir y subir imágenes Docker](#62-construir-y-subir-imágenes-docker)
   - 6.3 [Construir y subir los frontends a S3](#63-construir-y-subir-los-frontends-a-s3)
   - 6.4 [Verificar el despliegue](#64-verificar-el-despliegue)
7. [Actualizar la infraestructura](#7-actualizar-la-infraestructura)
8. [Decisiones de arquitectura relevantes](#8-decisiones-de-arquitectura-relevantes)
9. [Monitoreo y operaciones](#9-monitoreo-y-operaciones)

---

## 1. Visión general

SANarte es una plataforma de comercio de artesanías compuesta por **tres microservicios
Spring Boot** y **dos frontends Angular**. Toda la infraestructura se define como código
usando **AWS CloudFormation** (`infrastructure/sanarte-stack.yml`).

El tráfico externo entra por un único punto (ALB → gateway) y el gateway enruta
internamente a los servicios backend usando **ECS Service Discovery** con DNS privado.
Los frontends se sirven como sitios estáticos desde **Amazon S3**.

### Estructura de microservicios

| Servicio | Puerto | Rol |
|---|---|---|
| `gateway-service` | 8080 | Única entrada pública. Enruta `/api/admin/**` y `/api/public/**`. Gestiona CORS. |
| `admin-products-service` | 8081 | CRUD de productos y categorías (uso interno de la plataforma) |
| `public-products-service` | 8082 | Endpoints de lectura para el catálogo público |
| PostgreSQL (RDS) | 5432 | Base de datos compartida por admin y public |

---

## 2. Servicios AWS utilizados

| Servicio | Rol |
|---|---|
| **VPC** | Red aislada con subnets públicas (ECS/ALB) y privada (RDS) |
| **Amazon ECR** | Registro de imágenes Docker de los tres microservicios |
| **Amazon ECS Fargate** | Ejecución de contenedores sin EC2 |
| **ECS Service Discovery** | DNS privado (`sanarte.local`) para comunicación interna entre contenedores |
| **AWS Cloud Map** | Namespace DNS privado que resuelve `admin-products.sanarte.local` y `public-products.sanarte.local` |
| **Application Load Balancer** | Único punto de entrada HTTP. Enruta todo al gateway. |
| **Amazon RDS PostgreSQL** | Base de datos gestionada en subnet privada |
| **Amazon S3** | Hosting estático de los dos frontends Angular |
| **Amazon CloudWatch** | Logs centralizados y alarmas de CPU / errores 5xx |

> **No se usan:** Route 53, ACM, CloudFront ni HTTPS (HTTP solamente en el estado actual).

---

## 3. Arquitectura desplegada

```
  Navegador (usuario/admin)
         │
         │ HTTP :80
         ▼
  ┌─────────────────────────────────────┐
  │   Application Load Balancer         │
  │   sanarte-alb-1867123048            │
  │   → reenvía todo a gateway :8080    │
  └───────────────┬─────────────────────┘
                  │
                  ▼
  ┌──────────────────────────────────────────────────────────┐
  │  VPC  10.0.0.0/16                                        │
  │                                                          │
  │  Subnet Pública 1  10.0.1.0/24  (us-east-1a)            │
  │  Subnet Pública 2  10.0.2.0/24  (us-east-1b)            │
  │                                                          │
  │  ┌─────────────────────────────────────────────────┐     │
  │  │  ECS Cluster: sanarte-cluster (Fargate)         │     │
  │  │                                                 │     │
  │  │  ┌──────────────────────────────────────────┐  │     │
  │  │  │  gateway-service  :8080                  │  │     │
  │  │  │  CorsWebFilter + Spring Cloud Gateway    │  │     │
  │  │  │  ADMIN_SERVICE_URL=                      │  │     │
  │  │  │    http://admin-products.sanarte.local:8081│ │     │
  │  │  │  PUBLIC_SERVICE_URL=                     │  │     │
  │  │  │    http://public-products.sanarte.local:8082│ │    │
  │  │  └───────────────┬──────────────────────────┘  │     │
  │  │                  │  ECS Service Discovery       │     │
  │  │         ┌────────┴────────┐  (DNS privado)      │     │
  │  │         ▼                ▼                      │     │
  │  │  ┌─────────────┐  ┌─────────────┐              │     │
  │  │  │admin-products│  │public-product│             │     │
  │  │  │:8081        │  │:8082        │              │     │
  │  │  └──────┬──────┘  └──────┬──────┘              │     │
  │  └─────────┼────────────────┼─────────────────────┘     │
  │            └────────┬───────┘                            │
  │                     ▼                                    │
  │  Subnet Privada  10.0.3.0/24                            │
  │  ┌───────────────────────────────┐                      │
  │  │  RDS PostgreSQL               │                      │
  │  │  sanarte-db / sanarte_db      │                      │
  │  └───────────────────────────────┘                      │
  └──────────────────────────────────────────────────────────┘

  Frontends (S3 Static Website):
  ┌─────────────────────────────────────────────────────────────┐
  │  Usuario:  s3://sanarte-frontend-user-243789392703          │
  │  Admin:    s3://sanarte-frontend-admin-243789392703         │
  │  → Ambos llaman a la API a través del ALB                   │
  └─────────────────────────────────────────────────────────────┘

  Logs:
    CloudWatch → /ecs/sanarte/gateway-service
    CloudWatch → /ecs/sanarte/admin-products-service
    CloudWatch → /ecs/sanarte/public-products-service
```

---

## 4. Recursos activos

| Recurso | Valor |
|---|---|
| **Stack CloudFormation** | `sanarte-production` (us-east-1) |
| **URL de la API** | `http://sanarte-alb-1867123048.us-east-1.elb.amazonaws.com` |
| **Frontend Usuario** | `http://sanarte-frontend-user-243789392703.s3-website-us-east-1.amazonaws.com` |
| **Frontend Admin** | `http://sanarte-frontend-admin-243789392703.s3-website-us-east-1.amazonaws.com` |
| **RDS endpoint** | `sanarte-db.cmzswmwoiwlo.us-east-1.rds.amazonaws.com:5432` |
| **RDS base de datos** | `sanarte_db` / usuario: `sanadmin` |
| **ECS Cluster** | `sanarte-cluster` |
| **ECR gateway** | `243789392703.dkr.ecr.us-east-1.amazonaws.com/sanarte/gateway-service` |
| **ECR admin** | `243789392703.dkr.ecr.us-east-1.amazonaws.com/sanarte/admin-products-service` |
| **ECR public** | `243789392703.dkr.ecr.us-east-1.amazonaws.com/sanarte/public-products-service` |
| **DNS interno admin** | `admin-products.sanarte.local:8081` |
| **DNS interno public** | `public-products.sanarte.local:8082` |

---

## 5. Prerrequisitos

### En la máquina local

- **AWS CLI v2** en `C:\Program Files\Amazon\AWSCLIV2\aws.exe`, credenciales configuradas en `us-east-1`
- **Docker Desktop** corriendo
- **Java 17** + Maven (para compilar los microservicios)
- **Node.js 22** + npm (para compilar los frontends Angular)

### Nota sobre PowerShell vs Bash

El ECR login **debe hacerse con Bash** (Git Bash o WSL) por problemas de encoding en PowerShell:

```bash
# En Git Bash:
/c/Program\ Files/Amazon/AWSCLIV2/aws.exe ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    243789392703.dkr.ecr.us-east-1.amazonaws.com
```

Los comandos AWS normales pueden ejecutarse desde PowerShell usando:
```powershell
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
& $aws <comando>
```

---

## 6. Despliegue desde cero

### 6.1 Crear el stack de CloudFormation

La plantilla está en `infrastructure/sanarte-stack.yml`. Crea todos los recursos
(VPC, ECR, ECS, ALB, RDS, S3, CloudMap, CloudWatch) de una sola vez.

```powershell
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$template = "C:\ruta\absoluta\al\proyecto\infrastructure\sanarte-stack.yml"

& $aws cloudformation create-stack `
  --stack-name sanarte-production `
  --template-body "file://$template" `
  --parameters ParameterKey=DBPassword,ParameterValue="TuContraseñaSegura123!" `
  --capabilities CAPABILITY_IAM `
  --region us-east-1
```

> Usa siempre la **ruta absoluta** al archivo de plantilla (no relativa).

Monitorear hasta `CREATE_COMPLETE` (~15 min por RDS):

```powershell
& $aws cloudformation describe-stacks `
  --stack-name sanarte-production `
  --region us-east-1 `
  --query "Stacks[0].StackStatus" --output text

# Ver eventos en tiempo real:
& $aws cloudformation describe-stack-events `
  --stack-name sanarte-production `
  --region us-east-1 `
  --query "StackEvents[0:8].{Resource:LogicalResourceId,Status:ResourceStatus}" `
  --output table
```

Una vez completado, obtener las URLs del stack:

```powershell
& $aws cloudformation describe-stacks `
  --stack-name sanarte-production `
  --region us-east-1 `
  --query "Stacks[0].Outputs" --output table
```

**Importante:** Anotar la URL del ALB que aparece en el output `APIUrl`. Actualizar
`environment.ts` en **ambos** frontends antes de compilarlos:

```typescript
// frontend-admin-artesanias/src/app/core/environment.ts
// frontend-user-artesanias/src/app/core/environment.ts
export const environment = {
  production: true,
  apiBaseUrl: 'http://<ALB-DNS-del-output>'
} as const;
```

---

### 6.2 Construir y subir imágenes Docker

Las imágenes se construyen localmente y se suben a ECR. Ejecutar **después** de que el
stack esté en `CREATE_COMPLETE` (los repos ECR deben existir).

```bash
# En Git Bash — login a ECR:
/c/Program\ Files/Amazon/AWSCLIV2/aws.exe ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    243789392703.dkr.ecr.us-east-1.amazonaws.com

ECR="243789392703.dkr.ecr.us-east-1.amazonaws.com"

# Gateway
cd gateway-service
docker build -t sanarte/gateway-service:latest .
docker tag sanarte/gateway-service:latest $ECR/sanarte/gateway-service:latest
docker push $ECR/sanarte/gateway-service:latest

# Admin
cd ../admin-products-service
docker build -t sanarte/admin-products-service:latest .
docker tag sanarte/admin-products-service:latest $ECR/sanarte/admin-products-service:latest
docker push $ECR/sanarte/admin-products-service:latest

# Public
cd ../public-products-service
docker build -t sanarte/public-products-service:latest .
docker tag sanarte/public-products-service:latest $ECR/sanarte/public-products-service:latest
docker push $ECR/sanarte/public-products-service:latest
```

Después de subir las imágenes, forzar un redeploy en ECS:

```powershell
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
foreach ($svc in @("gateway-service","admin-products-service","public-products-service")) {
  & $aws ecs update-service --cluster sanarte-cluster --service $svc `
    --force-new-deployment --region us-east-1
}
```

---

### 6.3 Construir y subir los frontends a S3

Primero verificar que `environment.ts` tiene la URL correcta del ALB, luego compilar
y sincronizar con S3.

**Frontend Admin:**

```bash
cd frontend-admin-artesanias
npm run build -- --configuration production

/c/Program\ Files/Amazon/AWSCLIV2/aws.exe s3 sync \
  dist/frontend-admin-artesanias/browser \
  s3://sanarte-frontend-admin-243789392703 \
  --delete --region us-east-1
```

**Frontend Usuario:**

```bash
cd frontend-user-artesanias
npm run build -- --configuration production

/c/Program\ Files/Amazon/AWSCLIV2/aws.exe s3 sync \
  dist/frontend-user-artesanias/browser \
  s3://sanarte-frontend-user-243789392703 \
  --delete --region us-east-1
```

---

### 6.4 Verificar el despliegue

```bash
# Salud del gateway a través del ALB:
curl http://sanarte-alb-1867123048.us-east-1.elb.amazonaws.com/actuator/health
# → {"status":"UP"}

# Crear una categoría de prueba:
curl -X POST http://sanarte-alb-1867123048.us-east-1.elb.amazonaws.com/api/admin/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","descripcion":"Prueba de despliegue"}'
# → {"idCategoria":1,"nombre":"Test","descripcion":"Prueba de despliegue"}

# Listar productos públicos:
curl http://sanarte-alb-1867123048.us-east-1.elb.amazonaws.com/api/public/productos
# → []  (vacío en primer despliegue)
```

Verificar que los contenedores están corriendo:

```powershell
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
& $aws ecs describe-services `
  --cluster sanarte-cluster `
  --services gateway-service admin-products-service public-products-service `
  --region us-east-1 `
  --query "services[*].{Nombre:serviceName,Corriendo:runningCount,Deseado:desiredCount}" `
  --output table
```

---

## 7. Actualizar la infraestructura

### Actualizar el stack de CloudFormation

```powershell
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$template = "C:\ruta\absoluta\al\proyecto\infrastructure\sanarte-stack.yml"

& $aws cloudformation update-stack `
  --stack-name sanarte-production `
  --template-body "file://$template" `
  --parameters ParameterKey=DBPassword,ParameterValue="TuContraseñaSegura123!" `
  --capabilities CAPABILITY_IAM `
  --region us-east-1
```

> **Nota:** Si el update cambia el tipo de un recurso existente (como ocurrió con
> CloudMapNamespace al pasar de HttpNamespace a PrivateDnsNamespace), CloudFormation
> rechaza el cambio. En ese caso hay que renombrar el recurso lógico en la plantilla
> para que CF lo trate como uno nuevo.

### Actualizar solo un microservicio (sin redeployar todo)

```bash
# 1. Reconstruir la imagen:
cd gateway-service
docker build -t sanarte/gateway-service:latest .
docker tag sanarte/gateway-service:latest 243789392703.dkr.ecr.us-east-1.amazonaws.com/sanarte/gateway-service:latest
docker push 243789392703.dkr.ecr.us-east-1.amazonaws.com/sanarte/gateway-service:latest

# 2. Forzar nuevo despliegue en ECS:
aws ecs update-service --cluster sanarte-cluster --service gateway-service \
  --force-new-deployment --region us-east-1
```

### Actualizar los frontends

```bash
# Recompilar y sincronizar (--delete elimina archivos obsoletos del bucket):
cd frontend-admin-artesanias
npm run build -- --configuration production
aws s3 sync dist/frontend-admin-artesanias/browser \
  s3://sanarte-frontend-admin-243789392703 --delete --region us-east-1
```

### Escalar un servicio

```powershell
& $aws ecs update-service `
  --cluster sanarte-cluster `
  --service public-products-service `
  --desired-count 2 `
  --region us-east-1
```

### Rollback a una revisión anterior

```powershell
# Listar revisiones disponibles:
& $aws ecs list-task-definitions --family-prefix sanarte-gateway --region us-east-1

# Volver a una revisión específica (ej. revisión 3):
& $aws ecs update-service `
  --cluster sanarte-cluster `
  --service gateway-service `
  --task-definition sanarte-gateway:3 `
  --region us-east-1
```

### Eliminar todo el stack

> **Antes de eliminar:** vaciar los buckets S3 y las imágenes ECR, porque CloudFormation
> no puede eliminar buckets con contenido ni repos ECR con imágenes.

```bash
# Vaciar buckets S3:
aws s3 rm s3://sanarte-frontend-user-243789392703 --recursive
aws s3 rm s3://sanarte-frontend-admin-243789392703 --recursive

# Eliminar imágenes ECR (repetir para admin y public):
aws ecr delete-repository --repository-name sanarte/gateway-service --force --region us-east-1
aws ecr delete-repository --repository-name sanarte/admin-products-service --force --region us-east-1
aws ecr delete-repository --repository-name sanarte/public-products-service --force --region us-east-1

# Eliminar el stack:
aws cloudformation delete-stack --stack-name sanarte-production --region us-east-1
```

> RDS crea un snapshot automático antes de eliminarse (`DeletionPolicy: Snapshot`).

---

## 8. Decisiones de arquitectura relevantes

### ECS Service Discovery en lugar de Service Connect

El gateway (Spring Cloud Gateway / Netty) usa un resolvedor DNS asíncrono propio que
**no pasa por el resolver del SO**. ECS Service Connect usa un proxy local que solo
funciona a través del resolver del SO, por lo que Netty no puede resolver los nombres
y devuelve `UnknownHostException`.

La solución fue usar **ECS Service Discovery con namespace DNS privado** (`sanarte.local`),
que crea registros A reales en Route 53 interno. Netty puede resolver `admin-products.sanarte.local`
directamente contra el servidor DNS de la VPC.

El gateway recibe las URLs como variables de entorno:
- `ADMIN_SERVICE_URL=http://admin-products.sanarte.local:8081`
- `PUBLIC_SERVICE_URL=http://public-products.sanarte.local:8082`

### CORS solo en el gateway

Tanto el gateway como los microservicios backend tenían CORS configurado, lo que causaba
que el header `Access-Control-Allow-Origin` se duplicara en cada respuesta (rechazado
por el navegador). El fix fue eliminar `CorsConfig.java` de `admin-products-service`
y `public-products-service`. El gateway es el único punto de entrada y gestiona CORS
con `CorsWebFilter`.

Los orígenes permitidos se configuran en el task definition del gateway:
```
CORS_ALLOWED_ORIGINS=http://sanarte-frontend-user-243789392703.s3-website-us-east-1.amazonaws.com,
                     http://sanarte-frontend-admin-243789392703.s3-website-us-east-1.amazonaws.com,
                     http://localhost:4200,http://localhost:4201
```

### Hash routing en el frontend de usuario

El frontend de usuario usa `withHashLocation()` en Angular Router para que las URLs
tengan la forma `/#/productos/1`. Esto es necesario porque S3 static website hosting,
aunque tiene `ErrorDocument: index.html`, devuelve ese HTML con **status 404**. Algunos
dispositivos (principalmente en redes móviles donde el operador inyecta sus propias
páginas de error) interceptan los 404 y nunca muestran el contenido. Con hash routing
el navegador solo solicita `/` a S3 (siempre devuelve 200) y Angular lee el fragmento
`#/productos/1` en el lado del cliente.

El frontend de admin **no** usa hash routing porque no necesita URLs compartibles para
rutas específicas.

### Health checks en los microservicios

Los microservicios incluyen `spring-boot-starter-actuator`. El ALB hace health check
al gateway en el puerto `8090` (management port) en `/actuator/health`. Los servicios
backend no están detrás del ALB directamente, por lo que no requieren que el ALB los
compruebe.

---

## 9. Monitoreo y operaciones

### Ver logs en tiempo real

```bash
# Logs del gateway (en Git Bash con MSYS_NO_PATHCONV=1):
MSYS_NO_PATHCONV=1 aws logs tail /ecs/sanarte/gateway-service --follow --region us-east-1

# Buscar errores en admin:
MSYS_NO_PATHCONV=1 aws logs filter-log-events \
  --log-group-name /ecs/sanarte/admin-products-service \
  --filter-pattern "ERROR" \
  --region us-east-1
```

En PowerShell (guardar a archivo para evitar problemas de encoding):

```powershell
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$stream = & $aws logs describe-log-streams `
  --log-group-name "/ecs/sanarte/gateway-service" `
  --order-by LastEventTime --descending --max-items 1 `
  --region us-east-1 --query "logStreams[0].logStreamName" --output text

& $aws logs get-log-events `
  --log-group-name "/ecs/sanarte/gateway-service" `
  --log-stream-name "$stream" `
  --region us-east-1 --limit 100 `
  --query "events[*].message" --output json | Out-File logs.txt -Encoding utf8
```

### Verificar Service Discovery

```powershell
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

# Ver IPs registradas por los servicios:
$adminId = & $aws servicediscovery list-services --region us-east-1 `
  --query "Services[?Name=='admin-products'].Id" --output text
& $aws servicediscovery list-instances --service-id $adminId --region us-east-1 `
  --query "Instances[*].Attributes.{IP:AWS_INSTANCE_IPV4,Estado:AWS_INIT_HEALTH_STATUS}" `
  --output table
```

### Alarmas incluidas

| Alarma | Condición | Acción recomendada |
|---|---|---|
| `sanarte-gateway-cpu-alta` | CPU gateway > 80% por 10 min | Aumentar `DesiredCount` del servicio gateway |
| `sanarte-alb-errores-5xx` | Más de 10 errores 5xx en 5 min | Revisar logs del gateway y de los servicios backend |

*SANarte — Infraestructura AWS con CloudFormation, ECS Fargate, Service Discovery y S3*
