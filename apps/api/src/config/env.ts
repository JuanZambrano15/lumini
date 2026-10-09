import { z } from 'zod';

/**
 * Variables de entorno de la API. Se validan al arrancar para fallar rápido
 * con un mensaje claro en vez de romperse más tarde en tiempo de ejecución.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32, 'Debe tener al menos 32 caracteres'),
  JWT_PARENT_SECRET: z.string().min(32, 'Debe tener al menos 32 caracteres'),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  PARENT_SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(600),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  /** Cantidad de proxies confiables delante de la API (nginx = 1). */
  TRUST_PROXY_HOPS: z.coerce.number().int().nonnegative().default(1),
  /** Opcional: sin clave, la función de preguntas a Lumi queda desactivada. */
  GEMINI_API_KEY: z.string().optional(),
  LUMI_MODEL: z.string().default('gemini-3.1-flash-lite'),
  LUMI_QUESTION_COST: z.coerce.number().int().positive().default(5),
  LUMI_DAILY_LIMIT: z.coerce.number().int().positive().default(10),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
