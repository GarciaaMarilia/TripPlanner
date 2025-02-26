import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { deleteLinkController } from "../controllers/delete-link-controller";

const deleteLinkParamsSchema = z.object({
 tripId: z.string().uuid(),
 linkId: z.string().uuid(),
});

export type DeleteLinkParamsSchema = z.infer<typeof deleteLinkParamsSchema>;

export async function deleteLink(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId/links/:linkId",
  {
   schema: {
    description: "Delete link for a trip",
    tags: ["Trips"],
    params: deleteLinkParamsSchema,
   },
  },
  deleteLinkController
 );
}
