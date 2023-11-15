import fastifyPostgres, {
  FastifyPostgresRouteOptions,
} from "@fastify/postgres";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

export const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
};

async function dbConnector(
  fastify: FastifyInstance,
  options: FastifyPostgresRouteOptions
) {
  fastify.register(fastifyPostgres, dbConfig);
}

export default fastifyPlugin(dbConnector);
