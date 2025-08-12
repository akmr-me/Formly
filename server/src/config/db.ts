import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { env } from "../config/env";
import { DB } from "../generated/prisma/kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
