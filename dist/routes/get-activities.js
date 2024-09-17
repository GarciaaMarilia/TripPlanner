"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivity = getActivity;
const zod_1 = __importDefault(require("zod"));
const dayjs_1 = require("../lib/dayjs");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const getActivitiesSchema = zod_1.default.object({
    tripId: zod_1.default.string().uuid(),
});
async function getActivity(app) {
    app.withTypeProvider().get("/trips/:tripId/activities", {
        schema: {
            params: getActivitiesSchema,
        },
    }, async (request) => {
        const { tripId } = request.params;
        const trip = await prisma_1.prisma.trip.findUnique({
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
            throw new client_error_1.ClientError("Invalid activity date.");
        }
        const differenceInDaysBetweentripStartAndEnd = (0, dayjs_1.dayjs)(trip.ends_at).diff(trip.starts_at, "days");
        const activities = Array.from({
            length: differenceInDaysBetweentripStartAndEnd + 1,
        }).map((_, index) => {
            const date = (0, dayjs_1.dayjs)(trip.starts_at).add(index, "days");
            return {
                data: date.toDate(),
                activities: trip.activities.filter((activity) => {
                    return (0, dayjs_1.dayjs)(activity.occurs_at).isSame(date, "days");
                }),
            };
        });
        return {
            activities,
        };
    });
}
