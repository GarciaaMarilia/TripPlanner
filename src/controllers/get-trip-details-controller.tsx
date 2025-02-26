import { FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { GetTripDetailsSchema } from "../routes/get-trip-details";

export async function getTripDetailsController(
 request: FastifyRequest<{ Params: GetTripDetailsSchema }>
) {
 const { tripId } = request.params;

 const trip = await prisma.trip.findUnique({
  where: { id: tripId },
  select: {
   id: true,
   destination: true,
   starts_at: true,
   ends_at: true,
   is_confirmed: true,
  },
 });

 if (!trip) {
  throw new ClientError("Trip not found.");
 }

 return {
  trip,
 };
}
