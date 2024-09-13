"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvite = createInvite;
const zod_1 = require("zod");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dayjs_1 = require("../lib/dayjs");
const prisma_1 = require("../lib/prisma");
const mail_1 = require("../lib/mail");
const client_error_1 = require("../errors/client-error");
const createInviteParamsSchema = zod_1.z.object({
    tripId: zod_1.z.string().uuid(),
});
const createInviteBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
async function createInvite(app) {
    app.withTypeProvider().post("/trips/:tripId/invites", {
        schema: {
            params: createInviteParamsSchema,
            body: createInviteBodySchema,
        },
    }, async (request) => {
        const { tripId } = request.params;
        const { email } = request.body;
        const trip = await prisma_1.prisma.trip.findUnique({
            where: { id: tripId },
        });
        if (!trip) {
            throw new client_error_1.ClientError("Trip not found.");
        }
        const participant = await prisma_1.prisma.participant.create({
            data: {
                email,
                trip_id: tripId,
            },
        });
        const formattedStartDate = (0, dayjs_1.dayjs)(trip.starts_at).format("LL");
        const formattedEndDate = (0, dayjs_1.dayjs)(trip.ends_at).format("LL");
        const mail = await (0, mail_1.getMailClient)();
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
        return { participantId: participant.id };
    });
}
