import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

/**
 * Generate the Prisma client for the database selected by DATABASE_URL.
 *
 * Local development keeps using SQLite (prisma/schema.prisma). Hosted
 * deployments receive a postgres:// DATABASE_URL, so we derive an equivalent
 * Postgres schema on the fly and generate that client instead.
 */
const url = process.env.DATABASE_URL ?? "";
const isPostgres = /^(postgres|postgresql|prisma\+postgres):\/\//.test(url);

const basePath = "prisma/schema.prisma";
const generatedPath = "prisma/schema.postgres.prisma";
let schema = basePath;

if (isPostgres) {
  const base = readFileSync(basePath, "utf8");
  const postgres = base
    .replace('provider = "sqlite"', 'provider = "postgresql"')
    .replace(
      /generator client \{\n  provider = "prisma-client-js"\n\}/,
      'generator client {\n  provider      = "prisma-client-js"\n  binaryTargets = ["native", "rhel-openssl-3.0.x"]\n}',
    );

  if (!postgres.includes('provider = "postgresql"')) {
    throw new Error("Gagal membuat schema Postgres dari schema SQLite.");
  }

  writeFileSync(generatedPath, postgres);
  schema = generatedPath;
}

const prisma = process.platform === "win32" ? "prisma.cmd" : "prisma";
execFileSync(prisma, ["generate", "--schema", schema], { stdio: "inherit" });
console.log(`Prisma client generated for ${isPostgres ? "Postgres" : "SQLite"}.`);
