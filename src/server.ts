import fastify from "fastify";
import cors from "@fastify/cors";

import {
 serializerCompiler,
 validatorCompiler,
} from "fastify-type-provider-zod";

import { authRoutes } from "./routes/auth";
import { getTrips } from "./routes/get-trips";
import { getLinks } from "./routes/get-links";
import { errorHandler } from "./error-handler";
import { createTrip } from "./routes/create-trip";
import { createLink } from "./routes/create-link";
import { updateTrip } from "./routes/update-trip";
import { confirmTrip } from "./routes/confirm-trip";
import { getActivity } from "./routes/get-activities";
import { createActivity } from "./routes/create-activity";
import { getParticipant } from "./routes/get-participant";
import { deleteActivity } from "./routes/delete-activity";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipants } from "./routes/get-participants";
import { confirmParticipants } from "./routes/confirm-participant";
import { env } from "./env";

const app = fastify();

app.register(cors, {
 // garantir a segurança e dizer qual frontend pode acessar o backend. Por enquanto, estamos em produçao, entao, vamos setar como true e todo frontend podera acessar, porém, em produçao, mudaermos isso
 origin: "*",
});

app.setValidatorCompiler(validatorCompiler); // tratamento de dados com zod
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler); // tratamento de erros

app.get("/", async (request, reply) => {
 return { message: "Olá, bem-vindo ao servidor!" };
});

app.register(getLinks);
app.register(getTrips);
app.register(createTrip);
app.register(createLink);
app.register(updateTrip);
app.register(authRoutes);
app.register(confirmTrip);
app.register(getActivity);
app.register(createActivity);
app.register(getTripDetails);
app.register(getParticipant);
app.register(deleteActivity);
app.register(getParticipants);
app.register(confirmParticipants);

app.listen({ port: env.PORT }).then((port) => {
 console.log("Server running", port);
});
