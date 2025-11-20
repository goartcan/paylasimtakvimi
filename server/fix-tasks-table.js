// EMERGENCY FIX: Tasks tablosunu yeniden oluştur
// Manuel ALTER TABLE ile bozulan yapıyı düzelt
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
console.log("🔧 Database path:", dbFilePath);

const db = new Database(dbFilePath);

try {
  console.log("📦 Mevcut görevler yedekleniyor...");
  
  // Mevcut görevleri yedekle (varsa)
  let backup = [];
  try {
    backup = db.prepare("SELECT * FROM tasks").all();
    console.log(`✅ ${backup.length} görev yedeklendi`);
  } catch (err) {
    console.log("ℹ️  Yedeklenecek görev yok veya tablo mevcut değil");
  }

  // Eski tabloyu sil
  console.log("🗑️  Eski tasks tablosu siliniyor...");
  db.exec("DROP TABLE IF EXISTS tasks");
  
  // Yeni tabloyu oluştur (DOĞRU yapıyla)
  console.log("🆕 Yeni tasks tablosu oluşturuluyor...");
  db.exec(`
    CREATE TABLE tasks (
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
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `);
  
  // Yedeklenen görevleri geri yükle
  if (backup.length > 0) {
    console.log("♻️  Görevler geri yükleniyor...");
    const insertStmt = db.prepare(`
      INSERT INTO tasks 
      (user_id, title, description, note, status, assignee, priority, due_date, owner_id, created_by, created_at, updated_at) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    backup.forEach(task => {
      insertStmt.run(
        task.user_id,
        task.title,
        task.description || null,
        task.note || null,
        task.status || 'todo',
        task.assignee || null,
        task.priority || null,
        task.due_date || null,
        task.owner_id || null,
        task.created_by || task.user_id,
        task.created_at || null,
        task.updated_at || null
      );
    });
    console.log(`✅ ${backup.length} görev geri yüklendi`);
  }
  
  // Tablo yapısını kontrol et
  const tableInfo = db.prepare("PRAGMA table_info(tasks)").all();
  console.log("\n📋 Yeni tablo yapısı:");
  tableInfo.forEach(col => {
    console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? '(PRIMARY KEY)' : ''}`);
  });
  
  console.log("\n✅ Tasks tablosu başarıyla yeniden oluşturuldu!");
  console.log("🎉 Artık görev oluşturabilirsin!");
  
} catch (err) {
  console.error("❌ FIX FAILED:", err);
  process.exit(1);
}

db.close();
process.exit(0);

