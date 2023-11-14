import { FastifyInstance, RouteOptions } from "fastify";
import { LocationModel } from "../model/locationModel";

interface IQuerystring {
  limit?: string;
  location?: string;
  exclude?: string | string[];
}

interface IParams {
  location: LocationModel["id"];
}

async function locationRouter(fastify: FastifyInstance, options: RouteOptions) {
  fastify.get<{ Querystring: IQuerystring }>("/locations", (request, reply) => {
    let text = "SELECT * FROM location";
    let values: any[] = [];

    if (request.query.location) {
      const [lat, lon] = request.query.location.split(",");
      text += " WHERE 100 < spherical_distance(lat, lon, $1, $2)";
      values = [lat, lon];

      if (request.query.exclude) {
        const exclude = typeof Array.isArray(request.query.exclude)
          ? [request.query.exclude]
          : request.query.exclude;

        text += " AND id != ALL($3::integer[])";
        values.push(exclude);
      }
    } else if (request.query.exclude) {
      const exclude = typeof Array.isArray(request.query.exclude)
        ? [request.query.exclude]
        : request.query.exclude;

      text += " WHERE id != ALL($1::integer[])";
      values = [exclude];
    }

    text += " ORDER BY random()";

    if (request.query.limit) {
      text += ` LIMIT $${values.length + 1}`;
      values.push(request.query.limit);
    }

    text += ";";

    fastify.pg.query(text, values, (err, result) => {
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
