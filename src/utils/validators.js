// Funciones pequeñas de validación reutilizadas por los controllers.

// Convierte un id de la URL o del body a entero positivo.
// Devuelve null si no es válido (por ejemplo "abc", "-1" o "1.5").
const parseId = (value) => {
  const text = String(value ?? "").trim();

  if (!/^\d+$/.test(text)) {
    return null;
  }

  const id = Number(text);

  return id > 0 && id <= 2147483647 ? id : null; // límite de INTEGER en PostgreSQL
};

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

module.exports = {
  parseId,
  isNonEmptyString,
  isValidEmail,
};
