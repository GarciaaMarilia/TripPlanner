import z from "zod";
import nodemailer from "nodemailer";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";

const confirmTripSchema = z.object({
 tripId: z.string().uuid(),
});

interface ParticipantProps {
 id: string;
 name: string | null;
 email: string;
 is_confirmed: boolean;
}

export async function confirmTrip(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/confirm",
  {
   schema: {
    params: confirmTripSchema,
   },
  },
  async (request, reply) => {
   const { tripId } = request.params;

   const trip = await prisma.trip.findUnique({
    where: {
     id: tripId,
    },
    include: {
     participants: {
      where: {
       is_owner: false,
      },
     },
    },
   });

   if (!trip) {
    throw new ClientError("Trip not found.");
   }

   if (trip.is_confirmed) {
    return reply.redirect(`http://localhost:3000/trips/${tripId}`);
   }

   await prisma.trip.update({
    where: { id: tripId },
    data: { is_confirmed: true },
   });

   const formattedStartDate = dayjs(trip.starts_at).format("LL");
   const formattedEndDate = dayjs(trip.ends_at).format("LL");

   const mail = await getMailClient();

   await Promise.all(
    trip.participants.map(async (participant: ParticipantProps) => {
     const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

     const message = await mail.sendMail({
      from: {
       name: "Marilia",
       address: "garciaamarilia@gmail.com",
      },
      to: participant.email,
      subject: `Confirme sua viagem para ${trip.destination}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
              <p></p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
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
    })
   );
   return reply.redirect(`http://localhost:3000/trips/${tripId}`);
  }
 );
}
