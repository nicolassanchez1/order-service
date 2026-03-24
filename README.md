# 🛒 Orders Microservice - LinkTic Technical Test

Este repositorio contiene el microservicio de **Órdenes**, el motor transaccional del ecosistema de la prueba técnica de LinkTic.

Desarrollado en **NestJS 11**, este servicio es responsable de procesar las compras, verificar las reglas de negocio y comunicarse de forma segura con el catálogo para descontar el inventario tras una orden exitosa. Está diseñado bajo una arquitectura orientada a eventos síncronos (REST) y delega la orquestación principal al API Gateway.

## 🏗️ Arquitectura y Rol

Dentro del patrón de microservicios, este componente opera en el puerto `:3001` (por defecto) y maneja su propio dominio de datos.

- **Lecturas (Protegidas):** Permite a los clientes consultar su historial de compras de forma aislada (un usuario no puede ver las órdenes de otro).
- **Escrituras (Transaccionales):** Procesa la creación de órdenes. Este servicio inyecta el token de sesión y realiza llamadas HTTP (vía el API Gateway) hacia el _Products Service_ para actualizar dinámicamente el stock.

## 🛡️ Características Principales

1. **Defensa en Profundidad (Seguridad):** La autenticación no solo ocurre en el API Gateway. Este microservicio valida el JWT internamente y filtra las consultas a nivel de base de datos (`where: { userId }`) para evitar filtración de datos entre inquilinos.
2. **Transacciones Distribuidas:** Uso de `HttpModule` (Axios) para crear una coreografía entre microservicios, asegurando que el stock se descuente correctamente al registrar una orden.
3. **Validación de Datos:** Uso de DTOs (`CreateOrderDto`) y `ParseUUIDPipe` para garantizar la integridad de la información entrante.
4. **Documentación Swagger:** Decoradores de `@nestjs/swagger` implementados para autogenerar la especificación de la API.

## ⚙️ Configuración del Entorno (.env)

Crea un archivo `.env` en la raíz de este microservicio. Las variables mínimas recomendadas son:

```env
DB_HOST=postgres://usuario:password@localhost:5432/products_db (Ejemplo)
DB_PORT=5432
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_D9qgUOu7Ndai
DB_NAME=neondb
API_GATEWAY_URL=https://api-gateway-aslw.onrender.com
PORT=3001
JWT_SECRET=secret-key
```

## 🚀 Despliegue y Ejecución

Opción A: Ejecución Local (Desarrollo)

- Prerrequisitos
- Node.js (v18+)
- PostgreSQL

Pasos para ejecutar localmente

1. Clonar el repositorio e instalar dependencias:

```bash
# 1. Clonar repositorio
git clone [https://github.com/nicolassanchez1/order-service.git](https://github.com/nicolassanchez1/order-service.git)

# 2. Instalar dependencias
npm install

# 3. Levantar el servicio en modo desarrollo
npm run start:dev
```

2. Explorar la Documentación de la API (Swagger):

- Una vez en ejecución, puedes explorar e interactuar con los endpoints usando la integración nativa de Swagger en la siguiente ruta:

* Products API Swagger: http://localhost:3001/api

Opción B: Usando Docker (Producción)

```bash
# 1. Construir la imagen
docker build -t orders-service .

# 2. Correr el contenedor
docker run -p 3001:3001 --env-file .env orders-service
```

## 🛣️ Enrutamiento y Endpoints

A continuación, se detallan las rutas expuestas por el controlador interno. (Nota: Si consultas a través del API Gateway, la ruta base es `http://localhost:8080/orders).` Todos los endpoints de este microservicio están protegidos globalmente por el decorador `@UseGuards(AuthGuard('jwt')).`

| Métodos | Endpoint      | Descripción                                                      | Seguridad       |
| :------ | :------------ | :--------------------------------------------------------------- | :-------------- |
| `GET`   | `/orders`     | ➔ **Obtiene el historial de órdenes del usuario autenticado.**   | 🔒 Requiere JWT |
| `GET`   | `/orders/:id` | ➔ **Obtiene los detalles de una compra específica..**            | 🔒 Requiere JWT |
| `POST`  | `/orders`     | ➔ **Procesa una nueva orden y actualiza el stock del catálogo.** | 🔒 Requiere JWT |
