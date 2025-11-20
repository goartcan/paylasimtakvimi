# 🔧 TROUBLESHOOTING GUIDE - Görev Yönetimi Sorunları

**Ne Zaman Kullan:** Deploy tamamlandıktan sonra hala sorun varsa

---

## 🧪 TEST SENARYOLARıI

### Test #1: Görevler Yükleniyor mu?

**Adımlar:**
1. Tarayıcıda `localStorage.clear(); location.reload();` çalıştır
2. Giriş yap
3. F12 → Console'u aç
4. Görev Panosu'nu görüntüle

**Başarılı:**
```
✅ [GET /tasks] X görev döndürülüyor
✅ [refreshTaskBoard] Yüklenen görev sayısı: X
```

**Başarısız:**
```
❌ [loadTasksFromServer] Geçersiz ID'ye sahip görev filtrelendi
❌ [refreshTaskBoard] Yüklenen görev sayısı: 0
```

→ Eğer başarısız: **SORUN #1'e git**

---

### Test #2: Görev Oluşturma Çalışıyor mu?

**Adımlar:**
1. "Yeni Görev Ekle" butonuna tıkla
2. Form doldur:
   - Başlık: "Test Görevi"
   - Açıklama: "Test açıklaması"
   - Not: "Test notu"
3. Kaydet
4. Console'u kontrol et

**Başarılı:**
```
✅ [createTask] Backend'den dönen sonuç: {id: 123, title: "Test Görevi", ...}
✅ Görev kartı ekranda görünür
```

**Başarısız:**
```
❌ POST /tasks 500 (Internal Server Error)
❌ [createTask] Hata: Error: Görev oluşturulamadı
```

→ Eğer başarısız: **SORUN #2'ye git**

---

## 🔴 SORUN #1: Görevler Yüklenmiyor

### Olası Nedenler:

#### A) Backend Eski Görevleri Döndürüyor

**Belirti:**
```
[loadTasksFromServer] Geçersiz ID'ye sahip görev filtrelendi: {id: 'task_123_abc', ...}
```

**Çözüm:**
Backend'deki eski string ID'li görevleri temizlemen gerekiyor.

**Render.com'da Shell Aç:**
```bash
# Dashboard → Shell sekmesi

# 1. Database'e bağlan
cd /opt/render/project/src/server

# 2. Node REPL aç
node

# 3. Şunu çalıştır:
import('./db.js').then(({default: db}) => {
  // Eski görevleri sil
  const result = db.prepare("DELETE FROM tasks WHERE typeof(id) != 'integer'").run();
  console.log(`${result.changes} eski görev silindi`);
  process.exit(0);
});
```

#### B) Frontend Hala Eski Validation Kullanıyor

**Belirti:** Browser cache sorunu

**Çözüm:**
```javascript
// Chrome Console (F12):
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

**Safari:**
- Cmd + Opt + E (Cache temizle)
- Cmd + Shift + R (Hard refresh)

---

## 🔴 SORUN #2: Görev Oluşturma 500 Hatası

### Olası Nedenler:

#### A) Database Tablosu Hala Eksik Kolonlar İçeriyor

**Belirti:**
Server loglarında şunu görüyorsun:
```
[POST /tasks] Hata: SqliteError: no such column: note
```

**Çözüm:**
Manuel migration çalıştır.

**Render.com Dashboard → Shell:**
```bash
cd /opt/render/project/src/server

# Migration script'ini çalıştır
node migrate-tasks-update.js

# Beklenen çıktı:
✅ Column note added successfully!
✅ Column due_date added successfully!
✅ Column owner_id added successfully!
```

**Alternatif (eğer script başarısız olursa):**
```bash
# Node REPL
node

import('./db.js').then(({default: db}) => {
  // Kolonları kontrol et
  const columns = db.prepare("PRAGMA table_info(tasks)").all();
  console.log('Mevcut kolonlar:', columns.map(c => c.name));
  
  // Eksik kolonları ekle
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN note TEXT");
    console.log('✅ note eklendi');
  } catch(e) { console.log('note zaten var veya hata:', e.message); }
  
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN due_date TEXT");
    console.log('✅ due_date eklendi');
  } catch(e) { console.log('due_date zaten var veya hata:', e.message); }
  
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN owner_id INTEGER");
    console.log('✅ owner_id eklendi');
  } catch(e) { console.log('owner_id zaten var veya hata:', e.message); }
  
  // Doğrula
  const newColumns = db.prepare("PRAGMA table_info(tasks)").all();
  console.log('Yeni kolonlar:', newColumns.map(c => c.name));
  
  process.exit(0);
});
```

#### B) Database Tablosu Hiç Oluşturulmamış

**Belirti:**
Server loglarında şunu görüyorsun:
```
[Auto-Migration] Tasks table not found, skipping migration.
[POST /tasks] Hata: SqliteError: no such table: tasks
```

**Çözüm:**
Tabloyu manuel oluştur.

**Render.com Shell:**
```bash
cd /opt/render/project/src/server
node migrate-tasks.js

# Beklenen çıktı:
✅ Tasks table created successfully!
```

**Alternatif:**
```bash
node

import('./db.js').then(({default: db}) => {
  // Tablo var mı kontrol et
  const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").get();
  console.log('Tasks tablosu var mı?', !!exists);
  
  if (!exists) {
    // Tabloyu oluştur
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
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Tasks tablosu oluşturuldu!');
  }
  
  process.exit(0);
});
```

#### C) Database İzin Sorunu

**Belirti:**
```
[POST /tasks] Hata: SqliteError: attempt to write a readonly database
```

**Çözüm:**
Database dosyasının yazma izni var mı kontrol et.

**Render.com Shell:**
```bash
# Database dosyasını bul
find /opt/render -name "*.db" 2>/dev/null

# İzinleri kontrol et
ls -la /path/to/calendar.db

# Eğer read-only ise:
chmod 644 /path/to/calendar.db
```

---

## 🧹 NÜKLEer SEÇENEK: Database Sıfırlama

**UYARI:** Bu tüm görevleri siler!

**Ne Zaman Kullan:** Hiçbir şey işe yaramadıysa

**Render.com Shell:**
```bash
cd /opt/render/project/src/server

# 1. Mevcut database'i yedekle
cp calendar.db calendar.db.backup

# 2. Tasks tablosunu sil
node

import('./db.js').then(({default: db}) => {
  db.exec("DROP TABLE IF EXISTS tasks");
  console.log('✅ Tasks tablosu silindi');
  process.exit(0);
});

# 3. Server'ı restart et (Render Dashboard → Manual Deploy)

# Server restart olunca db.js yeni tabloyu oluşturacak
```

---

## 📊 LOG OKUMA REHBERİ

### Server Logs (Render.com Dashboard → Logs)

**Aranacak Mesajlar:**

#### ✅ Başarılı Durumlar:
```
✅ Tablo oluşturuldu: tasks
✅ [Auto-Migration] All columns already exist
✅ [Auto-Migration] 3 column(s) added successfully
[POST /tasks] Görev başarıyla oluşturuldu, id: 123
```

#### ❌ Hatalı Durumlar:
```
❌ [Auto-Migration] Failed: no such table: tasks
[POST /tasks] Hata: SqliteError: no such column: note
[POST /tasks] Hata: SqliteError: no such table: tasks
attempt to write a readonly database
```

### Browser Console Logs

#### ✅ Başarılı:
```
[loadTasksFromServer] Backend'den alınan görev sayısı: 5
[refreshTaskBoard] Yüklenen görev sayısı: 5
[createTask] Backend'den dönen sonuç: {id: 123, ...}
```

#### ❌ Hatalı:
```
[loadTasksFromServer] Geçersiz ID'ye sahip görev filtrelendi
POST /tasks 500 (Internal Server Error)
[createTask] Hata: Error: Görev oluşturulamadı
```

---

## 🆘 HALA ÇALIŞMIYOR?

### Toplam Bilgi

Eğer yukarıdaki tüm adımları denediysen ve hala çalışmıyorsa, şu bilgileri topla:

1. **Browser Console Çıktısı:**
   - F12 → Console → Tüm hataları kopyala

2. **Render.com Server Logs:**
   - Dashboard → Logs → Son 50 satırı kopyala

3. **Database Durumu:**
   ```bash
   # Render Shell'de:
   node -e "import('./db.js').then(({default: db}) => {
     console.log('=== TABLO LİSTESİ ===');
     const tables = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table'\").all();
     console.log(tables);
     
     console.log('\\n=== TASKS KOLONLARI ===');
     try {
       const cols = db.prepare(\"PRAGMA table_info(tasks)\").all();
       console.log(cols);
     } catch(e) { console.log('Tasks tablosu yok:', e.message); }
     
     console.log('\\n=== TASKS İÇERİĞİ ===');
     try {
       const tasks = db.prepare(\"SELECT * FROM tasks LIMIT 5\").all();
       console.log(tasks);
     } catch(e) { console.log('Hata:', e.message); }
     
     process.exit(0);
   })"
   ```

Bu 3 bilgiyi bana gönder, daha derin analiz yaparız.

---

## ⏱️ ZAMANLAMA

- **Test #1-2:** 2 dakika
- **Sorun #1 çözümü:** 5 dakika
- **Sorun #2 çözümü:** 10 dakika
- **Nükleer seçenek:** 5 dakika

**Toplam:** Maksimum 20 dakika içinde çözülmeli.

---

**Son Güncelleme:** 2025-11-20  
**Versiyon:** 1.0
