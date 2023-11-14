import { FastifyInstance, RouteOptions } from "fastify";
import { LocationModel } from "../model/locationModel";

interface IQuerystring {
  limit?: number;
}

interface IParams {
  location: LocationModel["id"];
}

async function locationRouter(fastify: FastifyInstance, options: RouteOptions) {
  fastify.get<{ Querystring: IQuerystring }>("/locations", (request, reply) => {
    let text = "SELECT * FROM location ORDER BY random()";

    if (request.query.limit) {
      text += ` limit ${request.query.limit};`;
    } else {
      text += ";";
    }

    fastify.pg.query(text, (err, result) => {
      reply.send(err || result.rows);
    });
  });

  fastify.get<{ Params: IParams }>("/locations/:location", (request, reply) => {
    fastify.pg.query<LocationModel>(
      "SELECT * FROM location WHERE id=$1",
      [request.params.location],
      (err, result) => {
        reply.send(err || result.rows);
      }
    );
  });
}

export default locationRouter;
