# TECOPOS SSO Gateway MVP

Microsistema dockerizado desarrollado para la integración bancaria **Wells Fargo x TECOPOS**. Implementa una arquitectura de microservicios con API Gateway, Single Sign-On y servicio bancario con notificaciones en tiempo real vía webhooks.

## Arquitectura

```
Cliente
  │
  ▼
Gateway (3000)          ← Rate limiting · Proxy
  ├── /auth/*  ──────► SSO Service (3001)     ← JWT · BCrypt · PostgreSQL
  ├── /accounts/*  ──► Banking Service (3002) ← MockAPI · Auth Guard
  ├── /operations/*──► Banking Service (3002) ← Webhooks en tiempo real
  └── /webhooks/* ───► Banking Service (3002)
```

---

## Despliegue local con Docker

### Requisitos

- [Docker](https://www.docker.com/) y Docker Compose instalados

### Pasos

```bash
# 1. Clonar el repositorio
git clone -b Develop https://github.com/RodryJR/nestjs-sso-gateway-mvp.git
cd nestjs-sso-gateway-mvp

# 2. Levantar todos los servicios
docker compose up --build

# 3. Verificar que todos los contenedores estén corriendo
docker compose ps
```

Los servicios estarán disponibles en:

| Servicio         | URL local                        |
|------------------|----------------------------------|
| Gateway          | http://localhost:3000            |
| Gateway Swagger  | http://localhost:3000/docs       |
| SSO Service      | http://localhost:3001            |
| SSO Swagger      | http://localhost:3001/docs       |
| Banking Service  | http://localhost:3002            |
| Banking Swagger  | http://localhost:3002/docs       |

### Variables de entorno (ya configuradas en docker-compose.yml)

| Variable              | Valor por defecto                                        |
|-----------------------|----------------------------------------------------------|
| `DATABASE_URL`        | `postgresql://tecopos:tecopos123@postgres:5432/sso_db`  |
| `JWT_SECRET`          | `tecopos_jwt_secret_2026`                                |
| `SSO_SERVICE_URL`     | `http://sso-service:3001`                                |
| `BANKING_SERVICE_URL` | `http://banking-service:3002`                            |
| `MOCKAPI_BASE_URL`    | `https://69cb00aaba5984c44bf403a2.mockapi.io/`           |

### Detener los servicios

```bash
docker compose down

# Para eliminar también los volúmenes (base de datos)
docker compose down -v
```

---

## API Pública desplegada

**URL base:** `https://gateway-public.up.railway.app`

**Swagger UI:** `https://gateway-public.up.railway.app/docs`

> Plataforma: [Railway](https://railway.app) — PostgreSQL + 3 microservicios en el mismo proyecto.

---

## Endpoints

Todos los endpoints se consumen a través del **Gateway**. Los endpoints de `/accounts`, `/operations` y `/webhooks` requieren autenticación con JWT Bearer Token.

### Autenticación

#### `POST /auth/register`
Registra un nuevo usuario y devuelve un token JWT.

**Request body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response `201`:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

---

#### `POST /auth/login`
Autentica un usuario y devuelve un token JWT.

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Errores:**
- `401` — Credenciales inválidas
- `409` — Email ya registrado

---

### Cuentas bancarias

> Requiere header: `Authorization: Bearer <token>`

#### `GET /accounts`
Devuelve el listado de todas las cuentas bancarias.

**Response `200`:**
```json
[
  {
    "id": "1",
    "accountNumber": "03130521",
    "owner": "Miss Tracy Nienow",
    "balance": "50.94",
    "currency": "Kyat",
    "createdAt": "2025-07-16T04:20:02.576Z"
  }
]
```

---

#### `GET /accounts/:id`
Devuelve una cuenta bancaria por su ID.

**Response `200`:**
```json
{
  "id": "1",
  "accountNumber": "03130521",
  "owner": "Miss Tracy Nienow",
  "balance": "50.94",
  "currency": "Kyat",
  "createdAt": "2025-07-16T04:20:02.576Z"
}
```

---

### Operaciones financieras

> Requiere header: `Authorization: Bearer <token>`

#### `GET /operations`
Devuelve todas las operaciones financieras registradas (fecha, operación, monto).

**Response `200`:**
```json
[
  {
    "id": "1",
    "accountId": 1,
    "date": "2026-03-30T12:51:31.978Z",
    "operation": "payment",
    "amount": "136.09"
  }
]
```

---

#### `GET /operations/account/:accountId`
Devuelve las operaciones filtradas por cuenta.

---

#### `POST /operations`
Crea una nueva operación financiera. Al crearse, notifica automáticamente a todos los webhooks suscritos al evento `operation.created`.

**Request body:**
```json
{
  "accountId": 1,
  "operation": "deposit",
  "amount": 500
}
```

**Response `200`:**
```json
{
  "id": "11",
  "accountId": 1,
  "operation": "deposit",
  "amount": 500,
  "date": "2026-03-31T00:04:24.946Z"
}
```

---

### Webhooks

> Requiere header: `Authorization: Bearer <token>`

#### `POST /webhooks/subscribe`
Registra una URL para recibir notificaciones en tiempo real cuando se crea una operación.

**Request body:**
```json
{
  "url": "https://wells-fargo.example.com/webhook",
  "event": "operation.created"
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "url": "https://wells-fargo.example.com/webhook",
  "event": "operation.created",
  "createdAt": "2026-03-31T00:00:00.000Z"
}
```

**Payload que recibe el webhook registrado al crearse una operación:**
```json
{
  "event": "operation.created",
  "timestamp": "2026-03-31T00:04:24.946Z",
  "data": {
    "accountId": 1,
    "operation": "deposit",
    "amount": 500
  }
}
```

---

#### `GET /webhooks`
Lista todos los webhooks registrados.

---

## Seguridad

- **Rate limiting** en el Gateway: 60 requests/min globales, 10 requests/min en rutas `/auth/*`
- **JWT** firmado con `HS256`, expiración de 24 horas
- **Contraseñas** hasheadas con `bcryptjs` (10 salt rounds)
- **Validación de token** inter-servicio: el banking-service valida cada request contra el SSO

---

## Test e2e

```bash
cd sso-service
npm run test:e2e
```

Cubre: registro de usuario, login exitoso y login con credenciales incorrectas.
