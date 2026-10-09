import {
  ANSWER_MAX_LENGTH,
  checkQuestion,
  normalize,
  QUESTION_MAX_LENGTH,
  sanitizeAnswer,
} from './content-filter';

describe('content-filter', () => {
  it('normaliza tildes, mayúsculas y espacios', () => {
    expect(normalize('  ¿Qué   ES la Dirección?  ')).toBe('¿que es la direccion?');
  });

  it('acepta una pregunta normal', () => {
    expect(checkQuestion('¿Por qué el cielo es azul?')).toEqual({
      allowed: true,
      text: '¿Por qué el cielo es azul?',
    });
  });

  it.each([
    ['mi correo es nina@gmail.com', 'personal_info'],
    ['llámame al 300 123 4567', 'personal_info'],
    ['vivo en la calle 45 sur', 'personal_info'],
    ['¿cuál es mi contraseña?', 'personal_info'],
    ['mira www.ejemplo.com', 'personal_info'],
    ['eres un pendejo', 'inappropriate'],
    ['hi', 'too_short'],
    ['a'.repeat(QUESTION_MAX_LENGTH + 1), 'too_long'],
  ])('bloquea "%s" (%s)', (question, reason) => {
    expect(checkQuestion(question)).toEqual({ allowed: false, reason });
  });

  it('no bloquea palabras que solo contienen una grosería como parte', () => {
    expect(checkQuestion('¿Qué es una computadora?').allowed).toBe(true);
  });

  it('quita enlaces y correos de la respuesta y la acorta', () => {
    expect(sanitizeAnswer('Mira https://x.com o escribe a a@b.co ya')).toBe('Mira o escribe a ya');
    expect(sanitizeAnswer('a'.repeat(ANSWER_MAX_LENGTH + 50)).length).toBe(ANSWER_MAX_LENGTH + 1);
  });
});
