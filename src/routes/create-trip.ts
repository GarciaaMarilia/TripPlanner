import z from "zod";
import nodemailer from "nodemailer";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

export const createTripSchema = z.object({
 id_user: z.string(),
 destination: z.string().min(4),
 starts_at: z.coerce.date(),
 ends_at: z.coerce.date().optional(),
 owner_name: z.string(),
 owner_email: z.string().email(),
 emails_to_invite: z.array(z.string().email()),
});

export async function createTrip(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips",
  {
   schema: {
    description: "Create a trip",
    tags: ["Trips"],
    body: createTripSchema,
   },
  },
  async (request) => {
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
       ...emails_to_invite.map((email) => {
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
    console.log("Trip Created:", trip);

    const formattedStartDate = dayjs(starts_at).format("LL");
    const formattedEndDate = ends_at && dayjs(ends_at).format("LL");

    const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`;

    const mail = await getMailClient();

    const message = await mail.sendMail({
     from: {
      name: "Marilia",
      address: "garciaamarilia@gmail.com",
     },
     to: {
      name: owner_name,
      address: owner_email,
     },
     subject: `Confirme sua viagem para ${destination}`,
     html: `
       <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
             <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
             <p></p>
             <p>Para confirmar sua viagem, clique no link abaixo:</p>
             <p></p>
             <p>
               <a href="${confirmationLink}">Confirmar viagem</a>
             </p>
             <p></p>
             <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
           </div>
       `.trim(),
    });

    console.log(nodemailer.getTestMessageUrl(message));

    return {
     tripId: trip.id,
    };
   } catch (error) {
    console.error("Error creating trip:", error);
    throw new ClientError("Failed to create trip.");
   }
  }
 );
}
