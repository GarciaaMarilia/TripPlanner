import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { errorResponseSchema } from "../errors/client-error";
import { getLinksController } from "../controllers/get-links-controller";

const getLinksParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const linkSchema = z.object({
 id: z.string().uuid(),
 title: z.string(),
 url: z.string().url(),
 trip_id: z.string().uuid(),
});

const getLinksResponseSchema = z.object({ links: z.array(linkSchema) });
export type GetLinksParamsSchema = z.infer<typeof getLinksParamsSchema>;

export async function getLinks(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/links",
  {
   schema: {
    description: "List all links for a trip",
    tags: ["Trips"],
    params: getLinksParamsSchema,
    response: {
     200: getLinksResponseSchema,
     400: errorResponseSchema,
    },
   },
  },
  getLinksController
 );
}
