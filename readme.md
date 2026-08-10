# MiniBlog API

API REST desarrollada con Node.js, Express y PostgreSQL.

## Swagger UI en Railway

La documentación interactiva de la API está disponible en la siguiente URL de Railway:

https://proyectom2-andyochoa-production.up.railway.app/docs/

Desde ahí puedes explorar los endpoints, ver los parámetros esperados y probar las solicitudes directamente en el navegador. Para usarla, simplemente abre el enlace en tu navegador y selecciona el servidor de la nube y prueba cualquier operación para ver su detalle o ejecutar una petición con el botón "Try it out".

## Tecnologías

- Node.js
- Express
- PostgreSQL
- pg
- Jest
- Supertest

## Instalación

```bash
npm install

VARIABLES DE ENTORNO 
    Crear un archivo .env:

        PORT=3000
        DATABASE_URL=postgresql://postgres:password@localhost:5432/miniblog
        NODE_ENV=development

BASE DE DATOS
    Crear la base:

        CREATE DATABASE miniblog;

    Ejecutar:

        database/schema.sql

    Después:

        database/seed.sql

EJECUTAR 

    Modo desarrollo:

        npm run dev

    Modo producción:

        npm start
    Tests
        npm test

ENDPOINTS

    Authors

        GET /authors

        GET /authors/:id

        POST /authors

        PUT /authors/:id

        DELETE /authors/:id

    Posts

        GET /posts

        GET /posts/:id

        GET /posts/author/:authorId

        POST /posts

        PUT /posts/:id

        DELETE /posts/:id



    # 29. Códigos HTTP utilizados

    Nuestra API utilizará:

    | Código | Significado | Ejemplo |
    |---|---|---|
    | `200` | OK | GET /authors |
    | `201` | Creado | POST /authors |
    | `204` | Sin contenido | DELETE /authors/1 |
    | `400` | Datos incorrectos | POST sin name |
    | `404` | No encontrado | GET /authors/999 |
    | `500` | Error del servidor | Error PostgreSQL |

    ---

    # 30. Flujo completo de una petición

    Por ejemplo:

    ```http
    POST /authors

llega primero a:

    app.js

Después:

    /authors

lo manda a:

    authors.routes.js

Luego:

    authors.controller.js

El controller valida:

    if (!name || !name.trim()) {
        return res.status(400).json(...)
    }

Si todo está bien:

    authors.service.js

ejecuta:

    INSERT INTO authors ...

    con parámetros:

    [name, email, bio]

    PostgreSQL devuelve el registro.

Finalmente:

    Service
    ↓
    Controller
    ↓
    Response 201

DOCUMENTACION DEL USO DE IA

Visita el siguiente enlace en drive para poder visualizar el pdf:

https://drive.google.com/file/d/1NmiPkQgbaM1UC-lPjyT-Zjg9Yi20RR0z/view?usp=sharing