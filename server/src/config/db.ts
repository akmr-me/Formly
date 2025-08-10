import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { DB } from "../../generated/prisma/kysely";
import { env } from "../config/env";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
