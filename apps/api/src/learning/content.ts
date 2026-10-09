import { z } from 'zod';
import type { ActivityKind } from '../generated/prisma/enums';

// Las preguntas y tutoriales se guardan como JSON en la base de datos.
// Se validan al leerlos para no confiar ciegamente en el contenido almacenado.

export const questionSchema = z.object({
  prompt: z.string().min(1),
  visual: z.string().optional(),
  options: z.array(z.string().min(1)).min(2),
  answer: z.number().int().nonnegative(),
});
export type Question = z.infer<typeof questionSchema>;
export type PublicQuestion = Omit<Question, 'answer'>;

export const tutorialStepSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  visual: z.string().optional(),
});
export type TutorialStep = z.infer<typeof tutorialStepSchema>;

export function parseQuestions(json: unknown): Question[] {
  return z
    .array(questionSchema)
    .min(1)
    .refine((questions) => questions.every((q) => q.answer < q.options.length), {
      message: 'Cada respuesta debe apuntar a una opción existente',
    })
    .parse(json);
}

export function parseTutorial(json: unknown): TutorialStep[] {
  return z.array(tutorialStepSchema).parse(json);
}

/** Quita la respuesta correcta antes de enviar las preguntas al cliente. */
export function toPublicQuestions(questions: Question[]): PublicQuestion[] {
  return questions.map(({ prompt, visual, options }) => ({ prompt, visual, options }));
}

export interface GradeResult {
  correct: number;
  total: number;
  results: boolean[];
}

/** Califica en el servidor: el cliente solo envía el índice elegido en cada pregunta. */
export function gradeAnswers(questions: Question[], answers: number[]): GradeResult {
  const results = questions.map((question, index) => answers[index] === question.answer);
  return {
    correct: results.filter(Boolean).length,
    total: questions.length,
    results,
  };
}

export const EVALUATION_PASS_RATIO = 0.8;
export const EVALUATION_PASS_BONUS = 3;

interface ActivityStarsInput {
  kind: ActivityKind;
  correct: number;
  total: number;
  /** Mejor número de aciertos en intentos anteriores (0 si es el primero). */
  previousBestCorrect: number;
  /** Si la evaluación ya se había aprobado antes. */
  passedBefore: boolean;
}

/**
 * Regla de estrellas: solo se gana por superar el récord propio en la actividad,
 * lo que premia mejorar y evita "farmear" repitiendo lo mismo. Aprobar una
 * evaluación por primera vez da un bono adicional.
 */
export function computeActivityStars(input: ActivityStarsInput): number {
  const improvement = Math.max(0, input.correct - input.previousBestCorrect);
  const passed = input.total > 0 && input.correct / input.total >= EVALUATION_PASS_RATIO;
  const bonus =
    input.kind === 'EVALUATION' && passed && !input.passedBefore ? EVALUATION_PASS_BONUS : 0;
  return improvement + bonus;
}
