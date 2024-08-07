import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

const getActivitiesSchema = z.object({
 tripId: z.string().uuid(),
});

export async function getActivity(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/activities",
  {
   schema: {
    params: getActivitiesSchema,
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
     activities: trip.activities.filter((activity) => {
      return dayjs(activity.occurs_at).isSame(date, "days");
     }),
    };
   });

   return {
    activities,
   };
  }
 );
}
