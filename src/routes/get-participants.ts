import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const getParticipantsSchema = z.object({
 tripId: z.string().uuid(),
});

export async function getParticipants(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/participants",
  {
   schema: {
    tags: ["Participants"],
    params: getParticipantsSchema,
   },
  },
  async (request) => {
   const { tripId } = request.params;

   const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
     participants: {
      select: {
       id: true,
       name: true,
       email: true,
       is_owner: true,
       is_confirmed: true,
      },
     },
    },
   });

   if (!trip) {
    throw new ClientError("Trip not found.");
   }

   return {
    participants: trip.participants,
   };
  }
 );
}
