// Database migration script - Tasks tablosunu oluştur
import Database from "better-sqlite3";
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
    return absolutePath;
  }

  const dataDir = path.join(os.tmpdir(), "paylasimtakvimi");
  return path.join(dataDir, "calendar.db");
};

const dbFilePath = resolveDbPath();
console.log("Database path:", dbFilePath);

const db = new Database(dbFilePath);

try {
  console.log("Creating tasks table...");
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'todo',
      assignee TEXT,
      priority TEXT,
      due_date TEXT,
      owner_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `);
  
  console.log("✅ Tasks table created successfully!");
  
  // Verify
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").all();
  console.log("Tasks table exists:", tables.length > 0);
  
  // Show all tables
  const allTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("All tables:", allTables.map(t => t.name).join(", "));
  
} catch (err) {
  console.error("❌ Migration failed:", err);
  process.exit(1);
}

db.close();
console.log("✅ Migration completed!");
process.exit(0);
