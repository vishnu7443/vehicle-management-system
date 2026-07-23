const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let dbClient = null;
let isPostgres = false;

// Create pg Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'vms_db',
  connectionTimeoutMillis: 2000
});

// Helper for unified query interface
const query = async (text, params = []) => {
  if (isPostgres) {
    return await pool.query(text, params);
  }

  // SQLite fallback engine
  return new Promise((resolve, reject) => {
    // Convert Postgres SQL syntax ($1, $2) to SQLite (?)
    let sqliteSql = text;
    params.forEach((_, idx) => {
      sqliteSql = sqliteSql.replace(`$${idx + 1}`, '?');
    });

    // Check if query is SELECT or modifying (INSERT, UPDATE, DELETE)
    const trimmed = sqliteSql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('EXPLAIN')) {
      dbClient.all(sqliteSql, params, (err, rows) => {
        if (err) return reject(err);
        resolve({ rows, rowCount: rows ? rows.length : 0 });
      });
    } else {
      dbClient.run(sqliteSql, params, function (err) {
        if (err) return reject(err);
        resolve({ rows: [], rowCount: this.changes, lastID: this.lastID });
      });
    }
  });
};

const initDatabaseConnection = async () => {
  try {
    // Attempt connecting to PostgreSQL
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isPostgres = true;
    console.log('✅ Connected successfully to PostgreSQL database!');
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection failed/unreachable. Falling back to SQLite local database engine for seamless operation.');
    isPostgres = false;
    const dbPath = path.join(__dirname, '../vms_local.db');
    dbClient = new sqlite3.Database(dbPath, (sqliteErr) => {
      if (sqliteErr) {
        console.error('❌ SQLite connection error:', sqliteErr);
      } else {
        console.log(`✅ SQLite fallback DB active at: ${dbPath}`);
      }
    });
  }
};

module.exports = {
  query,
  initDatabaseConnection,
  getIsPostgres: () => isPostgres
};
