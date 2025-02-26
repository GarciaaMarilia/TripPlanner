import dayjs from "dayjs";
import { FastifyRequest } from "fastify";

import {
 UpdateTripBodySchema,
 UpdateTripParamsSchema,
} from "../routes/update-trip";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function updateTripController(
 request: FastifyRequest<{
  Body: UpdateTripBodySchema;
  Params: UpdateTripParamsSchema;
 }>
) {
 const { tripId } = request.params;
 const { destination, starts_at, ends_at } = request.body;

 const trip = await prisma.trip.findUnique({
  where: {
   id: tripId,
  },
 });

 if (!trip) {
  throw new ClientError("Trip not found.");
 }

 if (dayjs(starts_at).isBefore(new Date())) {
  throw new ClientError("Invalid trip start date."); // validaçao das datas
 }

 if (dayjs(ends_at).isBefore(starts_at)) {
  throw new ClientError("Invalid trip end date."); // validaçao das datas
 }

 await prisma.trip.update({
  where: {
   id: tripId,
  },
  data: {
   destination,
   starts_at,
   ends_at,
  },
 });

 return {
  tripId: trip.id,
 };
}
