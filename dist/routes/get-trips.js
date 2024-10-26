"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrips = getTrips;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const getTripsSchema = zod_1.default.object({
    userId: zod_1.default.string(),
});
async function getTrips(app) {
    app.withTypeProvider().get("/listTrips/:userId", {
        schema: {
            params: getTripsSchema,
        },
    }, async (request) => {
        const { userId } = request.params;
        console.log("here", typeof userId, userId);
        const trips = await prisma_1.prisma.trip.findMany({
            where: {
                id_user: userId,
            },
        });
        if (!trips) {
            throw new client_error_1.ClientError("Trips not found.");
        }
        return {
            trips: trips,
        };
    });
}
