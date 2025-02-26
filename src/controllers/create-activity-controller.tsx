import dayjs from "dayjs";
import { FastifyReply, FastifyRequest } from "fastify";

import {
 CreateActivityBodySchema,
 CreateActivityParamsSchema,
} from "../routes/create-activity";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function createActivityController(
 request: FastifyRequest<{
  Body: CreateActivityBodySchema;
  Params: CreateActivityParamsSchema;
 }>,
 reply: FastifyReply
) {
 try {
  const { tripId } = request.params;
  const { title, occurs_at } = request.body; // a requisiçao post envia esses dados para a api

  const trip = await prisma.trip.findUnique({
   where: { id: tripId },
  });

  if (!trip) {
   throw new ClientError("Invalid activity date.");
  }

  if (dayjs(occurs_at).isBefore(trip.starts_at)) {
   throw new ClientError("Invalid activity start date."); // validaçao das datas
  }

  if (dayjs(occurs_at).isAfter(trip.ends_at)) {
   throw new ClientError("Invalid activity end date.");
  }

  const activity = await prisma.activity.create({
   data: {
    title,
    occurs_at,
    trip_id: tripId,
   },
  });

  return {
   activityId: activity.id,
  };
 } catch (error: unknown) {
  if (error instanceof ClientError) {
   reply.code(400).send({
    error: error.message,
   });
  }
 }
}
