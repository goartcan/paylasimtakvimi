import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Tüm görevleri getir (tüm kullanıcıların görevleri - herkes hepsini görür)
router.get("/", requireAuth, (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM tasks ORDER BY created_at DESC").all();
    console.log(`[GET /tasks] ${rows.length} görev döndürülüyor (user_id: ${req.userId})`);
    res.json(rows);
  } catch (err) {
    console.error("[GET /tasks] Hata:", err);
    res.status(500).json({ error: "Görevler alınamadı." });
  }
});

// Yeni görev oluştur
router.post("/", requireAuth, (req, res) => {
  try {
    console.log("[POST /tasks] Yeni görev oluşturuluyor, body:", req.body);
    
    const {
      title = "",
      description = "",
      status = "todo",
      assignee = "",
      priority = "medium"
    } = req.body;

    if (!title || !title.trim()) {
      console.warn("[POST /tasks] Başlık eksik");
      return res.status(400).json({ error: "Görev başlığı gerekli." });
    }

    const normalizedStatus = ["todo", "in-progress", "done"].includes(status)
      ? status
      : "todo";

    const insertStmt = db.prepare(`
      INSERT INTO tasks (user_id, title, description, status, assignee, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      req.userId,
      title.trim(),
      description || "",
      normalizedStatus,
      assignee || "",
      priority || "medium"
    );

    const inserted = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(result.lastInsertRowid);

    console.log("[POST /tasks] Görev başarıyla oluşturuldu, id:", inserted.id);
    res.json(inserted);
  } catch (err) {
    console.error("[POST /tasks] Hata:", err);
    res.status(500).json({ error: "Görev oluşturulamadı." });
  }
});

// Görevi güncelle (Admin herhangi bir görevi, normal kullanıcı kendi görevini güncelleyebilir)
router.put("/:id", requireAuth, (req, res) => {
  try {
    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: "Geçersiz görev kimliği." });
    }

    // Admin kontrolü
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.userId);
    const isAdmin = user && user.role === "admin";

    let existing;
    if (isAdmin) {
      // Admin herhangi bir görevi güncelleyebilir
      existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
    } else {
      // Normal kullanıcı sadece kendi görevini güncelleyebilir
      existing = db
        .prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
        .get(taskId, req.userId);
    }

    if (!existing) {
      return res.status(404).json({ error: "Görev bulunamadı." });
    }

    const {
      title = existing.title,
      description = existing.description || "",
      status = existing.status,
      assignee = existing.assignee || "",
      priority = existing.priority || "medium"
    } = req.body;

    const normalizedStatus = ["todo", "in-progress", "done"].includes(status)
      ? status
      : existing.status;

    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, assignee = ?, priority = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      title.trim(),
      description,
      normalizedStatus,
      assignee,
      priority,
      taskId
    );

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
    res.json(updated);
  } catch (err) {
    console.error("[PUT /tasks/:id] Hata:", err);
    res.status(500).json({ error: "Görev güncellenemedi." });
  }
});

// Görevi sil (Admin herhangi bir görevi, normal kullanıcı kendi görevini silebilir)
router.delete("/:id", requireAuth, (req, res) => {
  try {
    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: "Geçersiz görev kimliği." });
    }

    // Admin kontrolü
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.userId);
    const isAdmin = user && user.role === "admin";

    let info;
    if (isAdmin) {
      // Admin herhangi bir görevi silebilir
      info = db.prepare("DELETE FROM tasks WHERE id = ?").run(taskId);
    } else {
      // Normal kullanıcı sadece kendi görevini silebilir
      info = db
        .prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?")
        .run(taskId, req.userId);
    }

    if (info.changes === 0) {
      return res.status(404).json({ error: "Görev bulunamadı." });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /tasks/:id] Hata:", err);
    res.status(500).json({ error: "Görev silinemedi." });
  }
});

export default router;
