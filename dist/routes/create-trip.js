"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrip = createTrip;
const zod_1 = __importDefault(require("zod"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dayjs_1 = require("../lib/dayjs");
const prisma_1 = require("../lib/prisma");
const mail_1 = require("../lib/mail");
const client_error_1 = require("../errors/client-error");
const createTripSchema = zod_1.default.object({
    id_user: zod_1.default.string(),
    destination: zod_1.default.string().min(4),
    starts_at: zod_1.default.coerce.date(),
    ends_at: zod_1.default.coerce.date().optional(),
    owner_name: zod_1.default.string(),
    owner_email: zod_1.default.string().email(),
    emails_to_invite: zod_1.default.array(zod_1.default.string().email()),
});
async function createTrip(app) {
    app.withTypeProvider().post("/trips", {
        schema: {
            body: createTripSchema,
        },
    }, async (request) => {
        const { id_user, destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite, } = request.body;
        if ((0, dayjs_1.dayjs)(starts_at).isBefore(new Date())) {
            throw new client_error_1.ClientError("Invalid trip start date.");
        }
        if (ends_at && (0, dayjs_1.dayjs)(ends_at).isBefore(starts_at)) {
            throw new client_error_1.ClientError("Invalid trip end date.");
        }
        const tripData = {
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
        }
        else {
            tripData.ends_at = starts_at;
        }
        try {
            const trip = await prisma_1.prisma.trip.create({
                data: tripData,
            });
            console.log("Trip Created:", trip);
            const formattedStartDate = (0, dayjs_1.dayjs)(starts_at).format("LL");
            const formattedEndDate = ends_at && (0, dayjs_1.dayjs)(ends_at).format("LL");
            const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`;
            const mail = await (0, mail_1.getMailClient)();
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
            console.log(nodemailer_1.default.getTestMessageUrl(message));
            return {
                tripId: trip.id,
            };
        }
        catch (error) {
            console.error("Error creating trip:", error);
            throw new client_error_1.ClientError("Failed to create trip.");
        }
    });
}
