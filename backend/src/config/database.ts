import fastifyPostgres, {
  FastifyPostgresRouteOptions,
} from "@fastify/postgres";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

async function dbConnector(
  fastify: FastifyInstance,
  options: FastifyPostgresRouteOptions
) {
  fastify.register(fastifyPostgres, {
    connectionString: "postgres://hiroto@localhost:5432/overyonder_dev",
  });
}

export default fastifyPlugin(dbConnector);
