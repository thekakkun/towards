import { FastifyInstance, RouteOptions } from "fastify";
import { getAllLocations } from "../controllers/locationControllers";

async function locationRouter(fastify: FastifyInstance, options: RouteOptions) {
  fastify.get("/", getAllLocations);
}

export default locationRouter;
