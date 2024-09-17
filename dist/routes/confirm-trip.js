"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmTrip = confirmTrip;
const zod_1 = __importDefault(require("zod"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dayjs_1 = require("../lib/dayjs");
const prisma_1 = require("../lib/prisma");
const mail_1 = require("../lib/mail");
const client_error_1 = require("../errors/client-error");
const confirmTripSchema = zod_1.default.object({
    tripId: zod_1.default.string().uuid(),
});
async function confirmTrip(app) {
    app.withTypeProvider().get("/trips/:tripId/confirm", {
        schema: {
            params: confirmTripSchema,
        },
    }, async (request, reply) => {
        const { tripId } = request.params;
        const trip = await prisma_1.prisma.trip.findUnique({
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
            throw new client_error_1.ClientError("Trip not found.");
        }
        if (trip.is_confirmed) {
            return reply.redirect(`http://localhost:3000/trips/${tripId}`);
        }
        await prisma_1.prisma.trip.update({
            where: { id: tripId },
            data: { is_confirmed: true },
        });
        const formattedStartDate = (0, dayjs_1.dayjs)(trip.starts_at).format("LL");
        const formattedEndDate = (0, dayjs_1.dayjs)(trip.ends_at).format("LL");
        const mail = await (0, mail_1.getMailClient)();
        await Promise.all(trip.participants.map(async (participant) => {
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
            console.log(nodemailer_1.default.getTestMessageUrl(message));
        }));
        return reply.redirect(`http://localhost:3000/trips/${tripId}`);
    });
}
