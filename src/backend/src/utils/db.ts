import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

export const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
});

await client.connect()
