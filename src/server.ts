import dotenv from "dotenv";
import fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import {
 jsonSchemaTransform,
 serializerCompiler,
 validatorCompiler,
 ZodTypeProvider,
} from "fastify-type-provider-zod";

import { login } from "./routes/login";
import { getTrips } from "./routes/get-trips";
import { getLinks } from "./routes/get-links";
import { errorHandler } from "./error-handler";
import { createTrip } from "./routes/create-trip";
import { createLink } from "./routes/create-link";
import { updateTrip } from "./routes/update-trip";
import { deleteLink } from "./routes/delete-link";
import { deleteTrip } from "./routes/delete-trip";
import { confirmTrip } from "./routes/confirm-trip";
import { getActivity } from "./routes/get-activities";
import { registerUser } from "./routes/register-user";
import { createActivity } from "./routes/create-activity";
import { getParticipant } from "./routes/get-participant";
import { deleteActivity } from "./routes/delete-activity";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipants } from "./routes/get-participants";
import { deleteParticipant } from "./routes/delete-participant";
import { confirmParticipants } from "./routes/confirm-participant";

import authPlugin from "./plugins/authPlugin";

const app = fastify().withTypeProvider<ZodTypeProvider>();

// Carregar o arquivo `.env` correto com base no NODE_ENV
export const envFile =
 process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 3333;
const JWT_SECRET = process.env.JWT_SECRET || "default";

app.register(cors, {
 // garantir a segurança e dizer qual frontend pode acessar o backend. Por enquanto, estamos em produçao, entao, vamos setar como true e todo frontend podera acessar, porém, em produçao, mudaermos isso
 origin: "*",
 methods: ["GET", "POST", "PUT", "DELETE"],
 credentials: true,
 allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(authPlugin);

app.register(fastifySwagger, {
 // configuraçao do swagger (documentacao de rotas)
 openapi: {
  info: {
   title: "Typed TripPlanner API",
   version: "1.0.0",
  },
 },
 transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
 routePrefix: "/docs",
});

app.addHook("preHandler", async (request, reply) => {
 if (!request.url.startsWith("/login")) {
  // Esse plugin é usado em todas as rotas, exceto na de login.
  try {
   await app.authenticate(request, reply);
  } catch (err) {
   console.error(err);
   reply.code(401).send({ error: "Unauthorized" });
  }
 }
});

app.setValidatorCompiler(validatorCompiler); // tratamento de dados com zod
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler); // tratamento de erros

app.get("/", async () => {
 return { message: "Olá, bem-vindo ao servidor!" };
});

app.register(login);
app.register(getTrips);
app.register(getLinks);
app.register(createTrip);
app.register(createLink);
app.register(updateTrip);
app.register(deleteLink);
app.register(deleteTrip);
app.register(confirmTrip);
app.register(getActivity);
app.register(registerUser);
app.register(createActivity);
app.register(getTripDetails);
app.register(getParticipant);
app.register(deleteActivity);
app.register(getParticipants);
app.register(deleteParticipant);
app.register(confirmParticipants);

app.listen({ port: 3333 }).then(() => {
 console.log(`Server running on port ${PORT}`);
});
