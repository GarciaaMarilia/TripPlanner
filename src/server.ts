import fastify from "fastify";
import cors from "@fastify/cors";

import {
 serializerCompiler,
 validatorCompiler,
} from "fastify-type-provider-zod";

import { createTrip } from "./routes/create-trip";
import { confirmTrip } from "./routes/confirm-trip";

const app = fastify();

app.register(cors, {
 // garantir a segurança e dizer qual frontend pode acessar o backend. Por enquanto, estamos em produçao, entao, vamos setar como true e todo frontend podera acessar, porém, em produçao, mudaermos isso
 origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);

app.listen({ port: 3333 }).then(() => {
 console.log("Server running");
});
