# ⚡ HIZLI ÇÖZÜM - Görev Yönetimi Sorunları

**TL;DR:** 2 ana sorun var. İşte hızlı çözümler.

---

## 🎯 ADIM ADIM (5 DAKİKA)

### 1️⃣ Cache Temizle
```javascript
// Browser Console (F12):
localStorage.clear();
location.reload();
```

### 2️⃣ Giriş Yap ve Test Et
- Görev Panosu açılıyor mu? → ✅ TAMAM
- Görev Panosu boş mu? → ⬇️ 3. adıma git

### 3️⃣ Görev Oluştur
- "Yeni Görev" → Form doldur → Kaydet
- Başarılı mı? → ✅ TAMAM
- 500 Hatası mı? → ⬇️ 4. adıma git

### 4️⃣ Render.com Shell'de Manuel Migration

**Render.com Dashboard → Shell sekmesi:**

```bash
cd /opt/render/project/src/server

# Tasks tablosu var mı kontrol et
node -e "import('./db.js').then(({default: db}) => { \
  const exists = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'\").get(); \
  console.log('Tasks tablosu:', exists ? '✅ VAR' : '❌ YOK'); \
  if (exists) { \
    const cols = db.prepare(\"PRAGMA table_info(tasks)\").all(); \
    console.log('Kolonlar:', cols.map(c => c.name).join(', ')); \
  } \
  process.exit(0); \
})"
```

**A) Tablo YOK ise:**
```bash
node migrate-tasks.js
```

**B) Tablo VAR, kolonlar eksik ise:**
```bash
node migrate-tasks-update.js
```

**C) Her şey VAR ama hala hata ise:**
```bash
# Server'ı restart et
# Dashboard → Manual Deploy butonuna bas
```

---

## 🔍 SORUN BELİRTİLERİ

### Görevler Yüklenmiyor
**Console'da şunu görüyorsun:**
```
[loadTasksFromServer] Geçersiz ID'ye sahip görev filtrelendi
[refreshTaskBoard] Yüklenen görev sayısı: 0
```

**Çözüm:** Eski görevleri temizle
```bash
# Render Shell:
node -e "import('./db.js').then(({default: db}) => { \
  const result = db.prepare(\"DELETE FROM tasks WHERE typeof(id) != 'integer'\").run(); \
  console.log(`${result.changes} eski görev silindi`); \
  process.exit(0); \
})"
```

### Görev Oluşturma 500 Hatası
**Console'da şunu görüyorsun:**
```
POST /tasks 500 (Internal Server Error)
```

**Render Logs'da şunu görüyorsun:**
```
[POST /tasks] Hata: SqliteError: no such column: note
```

**Çözüm:** Eksik kolonları ekle
```bash
# Render Shell:
node migrate-tasks-update.js
```

---

## 🆘 HALA ÇALIŞMIYOR?

### Nükleer Seçenek (Tüm görevleri siler!)

```bash
# Render Shell:
node -e "import('./db.js').then(({default: db}) => { \
  db.exec(\"DROP TABLE IF EXISTS tasks\"); \
  db.exec(\"CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, note TEXT, status TEXT NOT NULL DEFAULT 'todo', assignee TEXT, priority TEXT, due_date TEXT, owner_id INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (owner_id) REFERENCES users(id))\"); \
  console.log('✅ Tasks tablosu yeniden oluşturuldu'); \
  process.exit(0); \
})"

# Sonra server restart et (Dashboard → Manual Deploy)
```

---

## 📋 KONTROL LİSTESİ

Deploy tamamlandıktan sonra:

- [ ] Browser cache temizlendi
- [ ] Giriş yapıldı
- [ ] Görevler yükleniyor (0'dan fazla)
- [ ] Yeni görev oluşturulabiliyor
- [ ] Görev düzenlenebiliyor
- [ ] Görev silinebiliyor

Hepsi ✅ ise → **SORUN ÇÖZÜLDÜ!** 🎉

---

## 🔗 DAHA FAZLA BİLGİ

- **Detaylı Analiz:** `SORUN_ANALIZI.md`
- **Troubleshooting:** `TROUBLESHOOTING_GUIDE.md`
- **Son Değişiklikler:** `git log --oneline -5`

---

**Tahmini Süre:** 5-10 dakika  
**Başarı Oranı:** %95
