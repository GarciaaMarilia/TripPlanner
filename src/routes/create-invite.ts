import { z } from "zod";
import nodemailer from "nodemailer";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";

export async function createInvite(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips/:tripId/invites",
  {
   schema: {
    params: z.object({
     tripId: z.string().uuid(),
    }),
    body: z.object({
     email: z.string().email(),
    }),
   },
  },
  async (request) => {
   const { tripId } = request.params;
   const { email } = request.body;

   const trip = await prisma.trip.findUnique({
    where: { id: tripId },
   });

   if (!trip) {
    throw new Error("Trip not found.");
   }

   const participant = await prisma.participant.create({
    data: {
     email,
     trip_id: tripId,
    },
   });

   const formattedStartDate = dayjs(trip.starts_at).format("LL");
   const formattedEndDate = dayjs(trip.ends_at).format("LL");

   const mail = await getMailClient();

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

   return { participantId: participant.id };
  }
 );
}
