import fastify from "fastify";
import cors from "@fastify/cors";

import {
 serializerCompiler,
 validatorCompiler,
} from "fastify-type-provider-zod";

import { getLinks } from "./routes/get-links";
import { createTrip } from "./routes/create-trip";
import { createLink } from "./routes/create-link";
import { updateTrip } from "./routes/update-trip";
import { confirmTrip } from "./routes/confirm-trip";
import { getActivity } from "./routes/get-activities";
import { createActivity } from "./routes/create-activity";
import { getParticipant } from "./routes/get-participant";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipants } from "./routes/get-participants";
import { confirmParticipants } from "./routes/confirm-participant";

const app = fastify();

app.register(cors, {
 // garantir a segurança e dizer qual frontend pode acessar o backend. Por enquanto, estamos em produçao, entao, vamos setar como true e todo frontend podera acessar, porém, em produçao, mudaermos isso
 origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getLinks);
app.register(createTrip);
app.register(createLink);
app.register(updateTrip);
app.register(confirmTrip);
app.register(getActivity);
app.register(createActivity);
app.register(getTripDetails);
app.register(getParticipant);
app.register(getParticipants);
app.register(confirmParticipants);

app.listen({ port: 3333 }).then(() => {
 console.log("Server running");
});
