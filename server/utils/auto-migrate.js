// Auto-migration helper - Server başlarken otomatik çalışır
import db from "../db.js";

export function runAutoMigrations() {
  try {
    console.log("[Auto-Migration] Checking for missing columns in tasks table...");
    
    // Tasks tablosu var mı kontrol et
    const tableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'")
      .get();
    
    if (!tableExists) {
      console.log("[Auto-Migration] Tasks table not found, skipping migration.");
      return;
    }
    
    // Mevcut kolonları kontrol et
    const tableInfo = db.prepare("PRAGMA table_info(tasks)").all();
    const existingColumns = tableInfo.map(col => col.name);
    
    // Eksik kolonları ekle
    const columnsToAdd = [
      { name: 'note', sql: 'ALTER TABLE tasks ADD COLUMN note TEXT' },
      { name: 'due_date', sql: 'ALTER TABLE tasks ADD COLUMN due_date TEXT' },
      { name: 'owner_id', sql: 'ALTER TABLE tasks ADD COLUMN owner_id INTEGER REFERENCES users(id)' }
    ];
    
    let addedCount = 0;
    columnsToAdd.forEach(col => {
      if (!existingColumns.includes(col.name)) {
        console.log(`[Auto-Migration] Adding column: ${col.name}`);
        db.exec(col.sql);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      console.log(`✅ [Auto-Migration] ${addedCount} column(s) added successfully!`);
    } else {
      console.log("✅ [Auto-Migration] All columns already exist, no migration needed.");
    }
    
  } catch (err) {
    console.error("❌ [Auto-Migration] Failed:", err.message);
    // Server'ı çökertme, sadece log'la
  }
}
