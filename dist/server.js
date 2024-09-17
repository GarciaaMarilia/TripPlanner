"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const auth_1 = require("./routes/auth");
const get_trips_1 = require("./routes/get-trips");
const get_links_1 = require("./routes/get-links");
const error_handler_1 = require("./error-handler");
const create_trip_1 = require("./routes/create-trip");
const create_link_1 = require("./routes/create-link");
const update_trip_1 = require("./routes/update-trip");
const confirm_trip_1 = require("./routes/confirm-trip");
const get_activities_1 = require("./routes/get-activities");
const create_activity_1 = require("./routes/create-activity");
const get_participant_1 = require("./routes/get-participant");
const delete_activity_1 = require("./routes/delete-activity");
const get_trip_details_1 = require("./routes/get-trip-details");
const get_participants_1 = require("./routes/get-participants");
const confirm_participant_1 = require("./routes/confirm-participant");
const env_1 = require("./env");
const app = (0, fastify_1.default)();
app.register(cors_1.default, {
    // garantir a segurança e dizer qual frontend pode acessar o backend. Por enquanto, estamos em produçao, entao, vamos setar como true e todo frontend podera acessar, porém, em produçao, mudaermos isso
    origin: "https://garciaamarilia.github.io/TripPlanner-Web/",
});
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler); // tratamento de dados com zod
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.setErrorHandler(error_handler_1.errorHandler); // tratamento de erros
app.register(get_links_1.getLinks);
app.register(get_trips_1.getTrips);
app.register(create_trip_1.createTrip);
app.register(create_link_1.createLink);
app.register(update_trip_1.updateTrip);
app.register(auth_1.authRoutes);
app.register(confirm_trip_1.confirmTrip);
app.register(get_activities_1.getActivity);
app.register(create_activity_1.createActivity);
app.register(get_trip_details_1.getTripDetails);
app.register(get_participant_1.getParticipant);
app.register(delete_activity_1.deleteActivity);
app.register(get_participants_1.getParticipants);
app.register(confirm_participant_1.confirmParticipants);
app.listen({ port: env_1.env.PORT }).then(() => {
    console.log("Server running");
});
