import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const getLinksSchema = z.object({
 tripId: z.string().uuid(),
});

export async function getLinks(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/links",
  {
   schema: {
    tags: ["Trips"],
    params: getLinksSchema,
   },
  },
  async (request) => {
   const { tripId } = request.params;

   const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
     links: true,
    },
   });

   if (!trip) {
    throw new ClientError("Trip not found.");
   }

   return {
    links: trip.links,
   };
  }
 );
}
