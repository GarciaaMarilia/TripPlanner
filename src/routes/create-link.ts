import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const createLinkParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const createLinkBodySchema = z.object({
 title: z.string().min(4),
 url: z.string().url(),
});

export async function createLink(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips/:tripId/links",
  {
   schema: {
    tags: ["Trips"],
    params: createLinkParamsSchema,
    body: createLinkBodySchema,
   },
  },
  async (request) => {
   const { tripId } = request.params;
   const { title, url } = request.body;

   const trip = await prisma.trip.findUnique({
    where: { id: tripId },
   });

   if (!trip) {
    throw new ClientError("Trip not found.");
   }

   const link = await prisma.link.create({
    data: {
     title,
     url,
     trip_id: tripId,
    },
   });

   return { linkId: link.id };
  }
 );
}
