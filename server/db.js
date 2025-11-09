import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import os from "os";
import dotenv from "dotenv";

dotenv.config();

const resolveDbPath = () => {
  const envPath = process.env.DATABASE_FILE || process.env.SQLITE_PATH;
  if (envPath && envPath.trim()) {
    const absolutePath = path.isAbsolute(envPath)
      ? envPath
      : path.join(process.cwd(), envPath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return absolutePath;
  }

  const dataDir = path.join(os.tmpdir(), "paylasimtakvimi");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "calendar.db");
};

const dbFilePath = resolveDbPath();
const db = new Database(dbFilePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    approved INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    text TEXT,
    files TEXT,
    communication TEXT,
    communication_type TEXT,
    platforms TEXT,
    owner_id INTEGER,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'planned',
    checked_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS day_flags (
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#fee2e2',
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS color_descriptions (
    key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT ''
  );
`);

function ensureColumn(table, column, definition) {
  const exists = db
    .prepare(`PRAGMA table_info(${table})`)
    .all()
    .some((col) => col.name === column);
  if (!exists) {
    try {
      db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
    } catch (err) {
      console.warn(
        `Kolon eklenirken hata oluştu (${table}.${column}): ${err.message}`
      );
    }
  }
}

ensureColumn("users", "role", "TEXT NOT NULL DEFAULT 'user'");
ensureColumn("users", "approved", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("users", "created_at", "TEXT NOT NULL DEFAULT (datetime('now'))");
ensureColumn("entries", "source", "TEXT NOT NULL DEFAULT 'manual'");
ensureColumn("entries", "color", "TEXT");
ensureColumn("entries", "note", "TEXT");
ensureColumn("entries", "status", "TEXT NOT NULL DEFAULT 'planned'");
ensureColumn("entries", "checked_at", "TEXT");
ensureColumn("entries", "owner_id", "INTEGER");
ensureColumn("day_flags", "color", "TEXT NOT NULL DEFAULT '#fee2e2'");

try {
  db.prepare("UPDATE users SET role = 'user' WHERE role IS NULL OR role = ''").run();
  db.prepare("UPDATE users SET approved = 0 WHERE approved IS NULL").run();
  db.prepare("UPDATE entries SET source = 'manual' WHERE source IS NULL OR source = ''").run();
  db.prepare("UPDATE entries SET status = 'planned' WHERE status IS NULL OR status = ''").run();
} catch (err) {
  console.warn("Veritabanı sütunları güncellenirken hata oluştu:", err.message);
}


export default db;
