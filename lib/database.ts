import mysql, { type Pool } from 'mysql2/promise';

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function requiredEnvironment(name: 'DB_HOST' | 'DB_NAME' | 'DB_USER' | 'DB_PASSWORD') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing_environment:${name}`);
  return value;
}

export function getDatabase() {
  if (pool) return pool;

  const configuredPort = Number(process.env.DB_PORT || 3306);
  pool = mysql.createPool({
    host: requiredEnvironment('DB_HOST'),
    port: Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 3306,
    user: requiredEnvironment('DB_USER'),
    password: requiredEnvironment('DB_PASSWORD'),
    database: requiredEnvironment('DB_NAME'),
    charset: 'utf8mb4',
    connectionLimit: 5,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10_000,
  });

  return pool;
}

export async function ensureDatabaseSchema() {
  if (!schemaReady) {
    schemaReady = initializeSchema().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function checkDatabaseConnection() {
  await ensureDatabaseSchema();
  await getDatabase().query('SELECT 1');
}

async function initializeSchema() {
  const database = getDatabase();
  await database.query(`CREATE TABLE IF NOT EXISTS site_content (
    id VARCHAR(64) PRIMARY KEY NOT NULL,
    payload LONGTEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    updated_at VARCHAR(32) NOT NULL,
    updated_by VARCHAR(254) NOT NULL
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await database.query(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
    login_key CHAR(64) PRIMARY KEY NOT NULL,
    failures INT NOT NULL DEFAULT 0,
    blocked_until BIGINT NOT NULL DEFAULT 0,
    updated_at BIGINT NOT NULL
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await database.query(`CREATE TABLE IF NOT EXISTS media_files (
    media_key VARCHAR(255) PRIMARY KEY NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    payload LONGBLOB NOT NULL,
    etag CHAR(64) NOT NULL,
    uploaded_by VARCHAR(254) NOT NULL,
    created_at VARCHAR(32) NOT NULL
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
}
