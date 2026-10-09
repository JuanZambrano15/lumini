// Primera capa de seguridad de Lumi: filtros locales y deterministas que se
// aplican ANTES de enviar nada a la IA (y sobre su respuesta). No reemplazan a
// la IA, pero garantizan que ciertos datos nunca salgan del servidor.

export const QUESTION_MIN_LENGTH = 3;
export const QUESTION_MAX_LENGTH = 300;
export const ANSWER_MAX_LENGTH = 1200;

export type BlockReason = 'too_short' | 'too_long' | 'personal_info' | 'inappropriate';

export type FilterResult =
  { allowed: true; text: string } | { allowed: false; reason: BlockReason };

/** Datos personales que un niño no debería compartir con un servicio externo. */
const PERSONAL_INFO_PATTERNS: RegExp[] = [
  /[\w.+-]+@[\w-]+\.[\w.]+/, // email
  /(?:\d[\s.-]?){7,}/, // teléfonos, documentos, cuentas
  /https?:\/\/|www\./i, // enlaces
  /\b(calle|carrera|cra|cll|avenida|diagonal|transversal)\s*\d+/i, // direcciones (Colombia)
  /\bmi\s+(direccion|contrasena|clave|telefono|celular|cedula|tarjeta)\b/i,
];

/** Lista corta de groserías y temas adultos. La IA cubre los casos más sutiles. */
const BLOCKED_WORDS = [
  'puta',
  'puto',
  'mierda',
  'hijueputa',
  'hpta',
  'gonorrea',
  'malparido',
  'pendejo',
  'verga',
  'marica',
  'porno',
  'xxx',
];

/** Minúsculas, sin tildes y sin espacios repetidos, para comparar de forma robusta. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function checkQuestion(raw: string): FilterResult {
  const text = raw.replace(/\s+/g, ' ').trim();
  if (text.length < QUESTION_MIN_LENGTH) return { allowed: false, reason: 'too_short' };
  if (text.length > QUESTION_MAX_LENGTH) return { allowed: false, reason: 'too_long' };

  const normalized = normalize(text);
  if (PERSONAL_INFO_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return { allowed: false, reason: 'personal_info' };
  }

  const words = new Set(normalized.split(/[^a-zñ0-9]+/));
  if (BLOCKED_WORDS.some((word) => words.has(word))) {
    return { allowed: false, reason: 'inappropriate' };
  }

  return { allowed: true, text };
}

/** Última capa: la respuesta mostrada a un niño nunca lleva enlaces ni correos. */
export function sanitizeAnswer(answer: string): string {
  const cleaned = answer
    .replace(/https?:\/\/\S+|www\.\S+/gi, '')
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
  return cleaned.length > ANSWER_MAX_LENGTH
    ? `${cleaned.slice(0, ANSWER_MAX_LENGTH).trimEnd()}…`
    : cleaned;
}

/** Respuestas fijas: en los casos delicados no dejamos que la IA improvise. */
export const SAFE_MESSAGES = {
  personal_info:
    '¡Cuidado! 🛡️ En internet nunca compartas tu dirección, teléfono, correo ni contraseñas. ¿Me preguntas de nuevo sin esos datos?',
  inappropriate: 'Esa pregunta tiene palabras poco amables. ¿La intentas de otra forma? 😊',
  too_short: 'Tu pregunta es muy cortita. ¡Cuéntame un poco más! 🤔',
  too_long: `Tu pregunta es muy larga. Intenta hacerla en menos de ${QUESTION_MAX_LENGTH} letras. ✂️`,
  redirect:
    'Esa pregunta es mejor hablarla con un adulto de confianza, como tus papás o tu profe. ¿Quieres preguntarme otra cosa? 🌟',
  self_harm:
    'Lo que sientes es muy importante 💜. Habla ahora mismo con un adulto de confianza: tus papás, un familiar o tu profe. En Colombia también puedes llamar gratis a la Línea 141 del ICBF.',
} as const;
