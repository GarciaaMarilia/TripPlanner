import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { errorResponseSchema } from "../errors/client-error";
import { createLinkController } from "../controllers/create-link-controller";

const createLinkParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const createLinkBodySchema = z.object({
 title: z.string().min(4),
 url: z.string().url(),
});

const createLinkResponseSchema = z.object({
 linkId: z.string().uuid(),
});

export type CreateLinkParamsSchema = z.infer<typeof createLinkParamsSchema>;
export type CreateLinkBodySchema = z.infer<typeof createLinkBodySchema>;
export type CreateLinkResponseSchema = z.infer<typeof createLinkResponseSchema>;

export async function createLink(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips/:tripId/links",
  {
   schema: {
    description: "Create a link",
    tags: ["Trips"],
    params: createLinkParamsSchema,
    body: createLinkBodySchema,
    response: {
     200: createLinkResponseSchema,
     400: errorResponseSchema,
    },
   },
  },
  createLinkController
 );
}
