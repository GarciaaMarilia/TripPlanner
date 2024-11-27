import { z } from "zod";

const envSchema = z.object({
 DATABASE_URL: z.string().url(),
 API_BASE_URL: z.string().url().default("http://localhost:3333"), // Fallback local
 PORT: z.coerce.number().default(3333),
 THE_HOST: z.string().default("0.0.0.0"), // Default em produção
});

export const env = envSchema.parse(process.env);
