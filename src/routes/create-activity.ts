import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const createActivityParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const createActivityBodySchema = z.object({
 title: z.string().min(4),
 occurs_at: z.coerce.date(),
});

const createActivityResponseSchema = z.object({
 activityId: z.string().uuid(),
});

export async function createActivity(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips/:tripId/activities",
  {
   schema: {
    description: "Create an activity",
    tags: ["Activities"],
    params: createActivityParamsSchema,
    body: createActivityBodySchema,
    response: {
     201: createActivityResponseSchema,
     204: z.string(),
    },
   },
  },
  async (request) => {
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
  }
 );
}
