import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { GetTripsSchema } from "../routes/get-trips";

export async function getTripsController(
 request: FastifyRequest<{ Params: GetTripsSchema }>,
 reply: FastifyReply
) {
 try {
  const { userId } = request.params;

  const trips = await prisma.trip.findMany({
   where: {
    id_user: userId,
   },
  });
  if (!trips || trips.length === 0) {
   throw new ClientError("Trips not found.");
  }

  return trips;
 } catch (error: unknown) {
  if (error instanceof ClientError) {
   reply.status(404).send({
    error: error.message,
   });
  }
 }
}
