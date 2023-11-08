import { FastifyReply, FastifyRequest } from "fastify";
import fastify from "../../app";

export const getAllLocations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await fastify.pg.query("SELECT * FROM location;");
  reply.send(result);
};
