import { Pool } from "pg";
import data from "./locations.json";
import { dbConfig } from "../src/config/database";

const pool = new Pool(dbConfig);

seedLocationTable();
createDistanceFunction();

async function seedLocationTable() {
  // Recreate table
  await pool.query("DROP TABLE IF EXISTS location;");

  await pool.query(`
  CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    city CHARACTER VARYING(128),
    country CHARACTER VARYING(128),
    link CHARACTER VARYING(256),
    lat REAL,
    lon REAL
  );`);

  // Insert data
  const text = `
  INSERT INTO location (city, country, link, lat, lon)
  VALUES ($1, $2, $3, $4, $5);`;

  for (const loc of data) {
    await pool.query(text, [
      loc["city"],
      loc["country"],
      loc["link"],
      loc["latitude"],
      loc["longitude"],
    ]);
  }

  await pool.end();
}

async function createDistanceFunction() {
  // Recreate haversine function
  await pool.query("DROP FUNCTION IF EXISTS hav CASCADE;");
  await pool.query(`CREATE FUNCTION
  hav(theta real) RETURNS real
    LANGUAGE SQL
    IMMUTABLE
    RETURNS NULL ON NULL INPUT
    RETURN sind(theta / 2) ^ 2;`);

  // Recreate spherical distance function
  await pool.query("DROP FUNCTION IF EXISTS spherical_distance CASCADE;");
  await pool.query(`CREATE FUNCTION
  spherical_distance(lat1 real, lon1 real, lat2 real, lon2 real) RETURNS real
  LANGUAGE SQL
  IMMUTABLE
  RETURNS NULL ON NULL INPUT
  RETURN 2 * 6371 * asin( -- Multiply central angle by earth's diameter
    sqrt(
      least( -- Clamp [0, 1] in case it exeeds ranges due to floating point error
        greatest(
          0.0,
          hav(lat2 - lat1) + cosd(lat1) * cosd(lat2) * hav(lon2 - lon1)
        ),
        1.0
      )
    )
  );`);
}
