import fastify from "fastify";
import cors from "@fastify/cors";

import {
 serializerCompiler,
 validatorCompiler,
} from "fastify-type-provider-zod";

import { createTrip } from "./routes/create-trip";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activities";
import { getLinks } from "./routes/get-links";
import { createLink } from "./routes/create-link";

const app = fastify();

app.register(cors, {
 // garantir a segurança e dizer qual frontend pode acessar o backend. Por enquanto, estamos em produçao, entao, vamos setar como true e todo frontend podera acessar, porém, em produçao, mudaermos isso
 origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipants);
app.register(createActivity);
app.register(getActivity);
app.register(createLink);
app.register(getLinks);

app.listen({ port: 3333 }).then(() => {
 console.log("Server running");
});
