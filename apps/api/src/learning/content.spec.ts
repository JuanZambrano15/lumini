import {
  computeActivityStars,
  EVALUATION_PASS_BONUS,
  gradeAnswers,
  parseQuestions,
  type Question,
  toPublicQuestions,
} from './content';

const questions: Question[] = [
  { prompt: '¿1 + 1?', options: ['1', '2'], answer: 1 },
  { prompt: '¿2 + 2?', options: ['4', '5'], answer: 0 },
  { prompt: '¿3 + 3?', options: ['5', '6', '7'], answer: 1 },
];

describe('content', () => {
  describe('parseQuestions', () => {
    it('acepta preguntas válidas', () => {
      expect(parseQuestions(questions)).toHaveLength(3);
    });

    it('rechaza una respuesta que apunta a una opción inexistente', () => {
      expect(() => parseQuestions([{ prompt: 'x', options: ['a', 'b'], answer: 2 }])).toThrow();
    });
  });

  describe('toPublicQuestions', () => {
    it('nunca expone la respuesta correcta', () => {
      for (const question of toPublicQuestions(questions)) {
        expect(question).not.toHaveProperty('answer');
      }
    });
  });

  describe('gradeAnswers', () => {
    it('cuenta aciertos y marca cada pregunta', () => {
      expect(gradeAnswers(questions, [1, 1, 1])).toEqual({
        correct: 2,
        total: 3,
        results: [true, false, true],
      });
    });
  });

  describe('computeActivityStars', () => {
    const base = {
      kind: 'PRACTICE' as const,
      total: 5,
      previousBestCorrect: 0,
      passedBefore: false,
    };

    it('da una estrella por acierto en el primer intento', () => {
      expect(computeActivityStars({ ...base, correct: 4 })).toBe(4);
    });

    it('solo premia la mejora sobre el récord anterior', () => {
      expect(computeActivityStars({ ...base, correct: 4, previousBestCorrect: 3 })).toBe(1);
      expect(computeActivityStars({ ...base, correct: 2, previousBestCorrect: 3 })).toBe(0);
    });

    it('da el bono la primera vez que se aprueba una evaluación', () => {
      const evaluation = { ...base, kind: 'EVALUATION' as const };
      expect(computeActivityStars({ ...evaluation, correct: 4 })).toBe(4 + EVALUATION_PASS_BONUS);
      expect(computeActivityStars({ ...evaluation, correct: 3 })).toBe(3);
      expect(
        computeActivityStars({
          ...evaluation,
          correct: 5,
          previousBestCorrect: 4,
          passedBefore: true,
        }),
      ).toBe(1);
    });
  });
});
