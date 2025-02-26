import dayjs from "dayjs";
import { FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { Activity, GetActivitesParamsSchema } from "../routes/get-activities";

export async function getActivitiesController(
 request: FastifyRequest<{ Params: GetActivitesParamsSchema }>
) {
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
   activities: trip.activities.filter((activity: Activity) => {
    return dayjs(activity.occurs_at).isSame(date, "days");
   }),
  };
 });

 return activities;
}
