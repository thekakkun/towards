import Fastify from "fastify";
import locationRouter from "./src/routes/locationRoutes";
import dbConnector from "./src/config/database";

const fastify = Fastify({ ignoreTrailingSlash: true, logger: true });

fastify.register(dbConnector);
fastify.register(locationRouter);

export default fastify;
