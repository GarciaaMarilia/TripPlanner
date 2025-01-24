import z from "zod";

export class ClientError extends Error {}

export const errorResponseSchema = z.object({ error: z.string() });
