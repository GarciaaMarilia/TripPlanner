import dayjs from "dayjs";
import { FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { CreateTripSchema } from "../routes/create-trip";

export async function createTripController(
 request: FastifyRequest<{ Body: CreateTripSchema }>
) {
 const {
  id_user,
  destination,
  starts_at,
  ends_at,
  owner_name,
  owner_email,
  emails_to_invite,
 } = request.body;

 if (dayjs(starts_at).isBefore(new Date())) {
  throw new ClientError("Invalid trip start date.");
 }

 if (ends_at && dayjs(ends_at).isBefore(starts_at)) {
  throw new ClientError("Invalid trip end date.");
 }

 const tripData: any = {
  id_user,
  destination,
  starts_at,
  participants: {
   createMany: {
    data: [
     {
      name: owner_name,
      email: owner_email,
      is_owner: true,
      is_confirmed: true,
     },
     ...emails_to_invite.map((email: string) => {
      return { email };
     }),
    ],
   },
  },
 };

 if (ends_at) {
  tripData.ends_at = ends_at;
 } else {
  tripData.ends_at = starts_at;
 }

 try {
  const trip = await prisma.trip.create({
   data: tripData,
  });

  return {
   tripId: trip.id,
  };
 } catch (error) {
  console.error("Error creating trip:", error);
  throw new ClientError("Failed to create trip.");
 }
}
