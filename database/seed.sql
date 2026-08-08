INSERT INTO authors (name, email, bio)
VALUES
(
    'Andy Ochoa',
    'andy@example.com',
    'Desarrollador web junior'
),
(
    'María López',
    'maria@example.com',
    'Escritora y desarrolladora'
),
(
    'Carlos Pérez',
    'carlos@example.com',
    'Entusiasta de la tecnología'
);

INSERT INTO posts (author_id, title, content, published)
VALUES
(
    1,
    'Mi primer post',
    'Este es el contenido de mi primer post.',
    true
),
(
    1,
    'Aprendiendo Node.js',
    'Estoy aprendiendo a construir APIs con Node.js y Express.',
    true
),
(
    2,
    'Introducción a PostgreSQL',
    'Post sobre conceptos básicos de PostgreSQL.',
    false
);