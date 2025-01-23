import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

export async function deleteLink(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId/links/:linkId",
  {
   schema: {
    tags: ["Trips"],
    params: z.object({
     tripId: z.string().uuid(),
     linkId: z.string().uuid(),
    }),
   },
  },
  async (request, reply) => {
   const { tripId, linkId } = request.params;

   try {
    const link = await prisma.link.deleteMany({
     where: {
      id: linkId,
      trip_id: tripId,
     },
    });
    if (link.count === 0) {
     throw new ClientError("Link not found.");
    }
    reply.status(200).send({ message: "Link deleted successfully." });
   } catch (error) {
    console.error(error);
    throw new ClientError("An unexpected error occured.");
   }
  }
 );
}
