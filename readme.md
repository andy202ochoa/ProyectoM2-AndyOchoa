# MiniBlog API

API REST para un blog: gestiona **autores** y sus **publicaciones (posts)**. Hecha con Node.js, Express y PostgreSQL, con pruebas en Jest + Supertest y documentación interactiva con Swagger UI.

> Proyecto Integrador del Módulo 2 del bootcamp Full Stack de Henry.

🔗 **Demo (Swagger UI):** https://proyecto-m2-andy-ochoa.vercel.app/docs
Desplegada en **Vercel** con base de datos **PostgreSQL en Neon** (plan gratuito). Desde ahí puedes probar todos los endpoints con "Try it out".

## Tecnologías

- Node.js + Express 5
- PostgreSQL (`pg`, consultas parametrizadas)
- Jest + Supertest
- Swagger UI (`swagger.yaml`, OpenAPI 3)

## Arquitectura

Cada petición pasa por capas:

```
app.js → routes → controllers (validan y responden) → services (SQL) → PostgreSQL
```

```
src/
├── app.js               # Express, Swagger, rutas, 404 y manejo de errores
├── index.js             # Arranca el servidor
├── config/db.js         # Pool de conexión a PostgreSQL
├── routes/              # authors.routes.js, posts.routes.js
├── controllers/         # Validan datos y devuelven el código HTTP correcto
├── services/            # Consultas SQL
├── middlewares/         # errorHandler.js
└── utils/validators.js  # Validación de ids, textos y emails
database/
├── schema.sql           # Tablas authors y posts
└── seed.sql             # Datos de ejemplo
test/                    # Pruebas de los endpoints
```

## Instalación

Requisitos: Node.js 20 o superior y PostgreSQL.

```bash
git clone https://github.com/andy202ochoa/ProyectoM2-AndyOchoa.git
cd ProyectoM2-AndyOchoa
npm install
```

### Variables de entorno

Copia `.env.example` como `.env` y completa los valores:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Cadena de conexión de PostgreSQL | `postgresql://postgres:TU_PASSWORD@localhost:5432/miniblog` |
| `NODE_ENV` | `development` o `production` (en producción activa SSL) | `development` |

### Base de datos

```sql
CREATE DATABASE miniblog;
```

Luego ejecuta, en este orden, `database/schema.sql` y `database/seed.sql` (por ejemplo desde pgAdmin o con `psql`):

```bash
psql -U postgres -d miniblog -f database/schema.sql
psql -U postgres -d miniblog -f database/seed.sql
```

## Uso

```bash
npm run dev    # desarrollo (se reinicia al guardar)
npm start      # producción
npm test       # pruebas (necesitan la base de datos configurada en .env)
```

Documentación interactiva: **http://localhost:3000/docs**

## Deploy en Vercel + Neon (demo actual)

1. En [Neon](https://neon.tech), crea un proyecto y ejecuta `database/schema.sql` y `database/seed.sql` en el **SQL Editor**.
2. En [Vercel](https://vercel.com), importa este repositorio. Vercel detecta Express y usa `src/app.js`, que exporta la app.
3. Agrega las variables de entorno `DATABASE_URL` (cadena de Neon con `-pooler`) y `NODE_ENV=production`, y despliega.

En Vercel, Swagger UI carga sus archivos desde un CDN y el pool de conexiones se limita a 3 (ver `src/app.js` y `src/config/db.js`).

## Deploy en Railway

1. En [Railway](https://railway.com), crea un proyecto con **Deploy from GitHub repo** y elige este repositorio.
2. En el mismo proyecto, agrega una base de datos: **+ Create → Database → PostgreSQL**.
3. En el servicio de la API, pestaña **Variables**, agrega:

   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referencia a la **URL interna** de la base, `postgres.railway.internal`, que solo funciona dentro de Railway) |
   | `NODE_ENV` | `production` |

   `PORT` no hace falta: Railway la asigna sola y la app la lee de `process.env.PORT`.
4. Crea las tablas: copia la **URL pública** de la base (variable `DATABASE_PUBLIC_URL` del servicio Postgres) y, desde tu PC, ejecuta `schema.sql` y `seed.sql` con `psql "<URL pública>" -f database/schema.sql` (y luego `seed.sql`), o pega su contenido en la pestaña **Data → Query** del servicio Postgres.
5. En el servicio de la API, **Settings → Networking → Generate Domain** crea la **URL pública** de la API. La documentación queda en `https://<tu-dominio>.up.railway.app/docs`.

Railway usa `npm start` (`node src/index.js`) para arrancar la app. El archivo `.env` nunca se sube a GitHub; en producción las variables se configuran en el panel de Railway.

## Endpoints

### Authors

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/authors` | Lista todos los autores |
| GET | `/authors/:id` | Obtiene un autor |
| POST | `/authors` | Crea un autor (`name` y `email` obligatorios, `bio` opcional) |
| PUT | `/authors/:id` | Actualiza un autor |
| DELETE | `/authors/:id` | Elimina un autor y sus posts |

### Posts

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/posts` | Lista todos los posts |
| GET | `/posts/:id` | Obtiene un post |
| GET | `/posts/author/:authorId` | Posts de un autor, con los datos del autor |
| POST | `/posts` | Crea un post (`author_id`, `title`, `content`; `published` opcional, por defecto `false`) |
| PUT | `/posts/:id` | Actualiza un post (si no se envía `published`, se mantiene) |
| DELETE | `/posts/:id` | Elimina un post |

Ejemplo de body para crear un post:

```json
{
  "author_id": 1,
  "title": "Aprendiendo Express",
  "content": "Hoy aprendí a crear rutas con Express.",
  "published": false
}
```

## Códigos HTTP

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| `200` | OK | `GET /authors` |
| `201` | Creado | `POST /authors` |
| `204` | Sin contenido | `DELETE /authors/1` |
| `400` | Datos incorrectos | `POST /authors` sin `name`, id no numérico (`/authors/abc`), email repetido, JSON mal escrito, autor inexistente |
| `404` | No encontrado | `GET /authors/999` |
| `500` | Error del servidor | Error inesperado de PostgreSQL |

Los errores siempre responden con el formato `{ "message": "..." }`.

## Documentación del uso de IA

[Ver documento PDF](https://drive.google.com/file/d/1NmiPkQgbaM1UC-lPjyT-Zjg9Yi20RR0z/view?usp=sharing)

## Autor

**Andy Ochoa** · [GitHub](https://github.com/andy202ochoa)
