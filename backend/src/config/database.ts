import { Pool } from "pg";

const pool = new Pool();

export function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
