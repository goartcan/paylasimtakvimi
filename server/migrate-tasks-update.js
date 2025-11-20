// Database migration script - Tasks tablosuna eksik kolonları ekle
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
  console.log("Updating tasks table with missing columns...");
  
  // Mevcut kolonları kontrol et
  const tableInfo = db.prepare("PRAGMA table_info(tasks)").all();
  const existingColumns = tableInfo.map(col => col.name);
  console.log("Existing columns:", existingColumns);
  
  // Eksik kolonları ekle
  const columnsToAdd = [
    { name: 'note', sql: 'ALTER TABLE tasks ADD COLUMN note TEXT' },
    { name: 'due_date', sql: 'ALTER TABLE tasks ADD COLUMN due_date TEXT' },
    { name: 'owner_id', sql: 'ALTER TABLE tasks ADD COLUMN owner_id INTEGER REFERENCES users(id)' }
  ];
  
  columnsToAdd.forEach(col => {
    if (!existingColumns.includes(col.name)) {
      console.log(`Adding column: ${col.name}`);
      db.exec(col.sql);
      console.log(`✅ Column ${col.name} added successfully!`);
    } else {
      console.log(`⏭️  Column ${col.name} already exists, skipping.`);
    }
  });
  
  console.log("✅ Migration completed!");
  
} catch (err) {
  console.error("❌ Migration failed:", err);
  process.exit(1);
}

db.close();
process.exit(0);
