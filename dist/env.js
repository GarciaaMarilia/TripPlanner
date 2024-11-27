"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    API_BASE_URL: zod_1.z.string().url().default("http://localhost:3333"), // Fallback local
    PORT: zod_1.z.coerce.number().default(3333),
    THE_HOST: zod_1.z.string().default("0.0.0.0"), // Default em produção
});
exports.env = envSchema.parse(process.env);
