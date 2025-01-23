import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const getActivitiesSchema = z.object({
 tripId: z.string().uuid(),
});

const activitySchema = z.object({
 id: z.string().uuid(),
 trip_id: z.string().uuid(),
 title: z.string().min(4),
 occurs_at: z.coerce.date(),
});

const activitiesResponseSchema = z.array(
 z.object({
  data: z.coerce.date(),
  activities: z.array(activitySchema),
 })
);

interface ActivityProps {
 id: string;
 trip_id: string;
 title: string | null;
 occurs_at: Date;
}

export async function getActivity(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/activities",
  {
   schema: {
    description: "List all activities for a trip",
    tags: ["Activities"],
    params: getActivitiesSchema,
    response: {
     200: activitiesResponseSchema,
    },
   },
  },
  async (request) => {
   const { tripId } = request.params;

   const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
     activities: {
      orderBy: {
       occurs_at: "asc",
      },
     },
    },
   });

   if (!trip) {
    throw new ClientError("Invalid activity date.");
   }

   const differenceInDaysBetweentripStartAndEnd = dayjs(trip.ends_at).diff(
    trip.starts_at,
    "days"
   );

   const activities = Array.from({
    length: differenceInDaysBetweentripStartAndEnd + 1,
   }).map((_, index) => {
    const date = dayjs(trip.starts_at).add(index, "days");

    return {
     data: date.toDate(),
     activities: trip.activities.filter((activity: ActivityProps) => {
      return dayjs(activity.occurs_at).isSame(date, "days");
     }),
    };
   });

   return activities;
  }
 );
}
