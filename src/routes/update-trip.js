"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrip = updateTrip;
const zod_1 = __importDefault(require("zod"));
const dayjs_1 = require("../lib/dayjs");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const updateTripParamsSchema = zod_1.default.object({
    tripId: zod_1.default.string().uuid(),
});
const updateTripBodySchema = zod_1.default.object({
    destination: zod_1.default.string().min(4),
    starts_at: zod_1.default.coerce.date(),
    ends_at: zod_1.default.coerce.date(),
});
async function updateTrip(app) {
    app.withTypeProvider().put("/trips/:tripId", {
        schema: {
            params: updateTripParamsSchema,
            body: updateTripBodySchema,
        },
    }, async (request) => {
        const { tripId } = request.params;
        const { destination, starts_at, ends_at } = request.body; // a requisiçao post envia esses dados para a api
        const trip = await prisma_1.prisma.trip.findUnique({
            where: {
                id: tripId,
            },
        });
        if (!trip) {
            throw new client_error_1.ClientError("Trip not found.");
        }
        if ((0, dayjs_1.dayjs)(starts_at).isBefore(new Date())) {
            throw new client_error_1.ClientError("Invalid trip start date."); // validaçao das datas
        }
        if ((0, dayjs_1.dayjs)(ends_at).isBefore(starts_at)) {
            throw new client_error_1.ClientError("Invalid trip end date."); // validaçao das datas
        }
        await prisma_1.prisma.trip.update({
            where: {
                id: tripId,
            },
            data: {
                destination,
                starts_at,
                ends_at,
            },
        });
        return {
            tripId: trip.id,
        };
    });
}
