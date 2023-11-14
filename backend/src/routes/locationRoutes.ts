import { FastifyInstance, RouteOptions } from "fastify";
import { LocationModel } from "../model/locationModel";

interface IParams {
  location: LocationModel["id"];
}

async function locationRouter(fastify: FastifyInstance, options: RouteOptions) {
  fastify.get("/locations", async (request, reply) => {
    const loc = request.query;

    const { rows } = await fastify.pg.query("SELECT * FROM location;");
    return rows;
  });

  fastify.get<{ Params: IParams }>(
    "/locations/:location",
    async (request, reply) => {
      const { rows } = await fastify.pg.query<LocationModel>(
        `SELECT * FROM location WHERE id=${request.params.location}`
      );

      if (!rows) {
        throw new Error("Location not found");
      }
      return rows;
    }
  );
}

export default locationRouter;
