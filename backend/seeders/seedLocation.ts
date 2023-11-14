import { Pool } from "pg";
import data from "./locations.json";
import { dbConfig } from "../src/config/database";

const pool = new Pool(dbConfig);

async function createAndInsert() {
  await pool.query("DROP TABLE IF EXISTS location;");

  await pool.query(`
    CREATE TABLE location (
      id SERIAL PRIMARY KEY,
      city CHARACTER VARYING(128),
      country CHARACTER VARYING(128),
      link CHARACTER VARYING(256),
      lat REAL,
      lon REAL   
    );
`);

  const text = `
  INSERT INTO location (city, country, link, lat, lon)
  VALUES ($1, $2, $3, $4, $5);
`;

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

createAndInsert();
