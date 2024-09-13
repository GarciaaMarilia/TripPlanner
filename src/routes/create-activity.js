"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivity = createActivity;
const zod_1 = __importDefault(require("zod"));
const dayjs_1 = require("../lib/dayjs");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
async function createActivity(app) {
    app.withTypeProvider().post("/trips/:tripId/activities", {
        schema: {
            params: zod_1.default.object({
                tripId: zod_1.default.string().uuid(),
            }),
            body: zod_1.default.object({
                title: zod_1.default.string().min(4),
                occurs_at: zod_1.default.coerce.date(),
            }),
        },
    }, async (request) => {
        const { tripId } = request.params;
        const { title, occurs_at } = request.body; // a requisiçao post envia esses dados para a api
        const trip = await prisma_1.prisma.trip.findUnique({
            where: { id: tripId },
        });
        if (!trip) {
            throw new client_error_1.ClientError("Invalid activity date.");
        }
        if ((0, dayjs_1.dayjs)(occurs_at).isBefore(trip.starts_at)) {
            throw new client_error_1.ClientError("Invalid activity start date."); // validaçao das datas
        }
        if ((0, dayjs_1.dayjs)(occurs_at).isAfter(trip.ends_at)) {
            throw new client_error_1.ClientError("Invalid activity end date.");
        }
        const activity = await prisma_1.prisma.activity.create({
            data: {
                title,
                occurs_at,
                trip_id: tripId,
            },
        });
        return {
            activityId: activity.id,
        };
    });
}
