import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Tüm görevleri getir (tüm kullanıcılar için ortak)
router.get("/", requireAuth, (req, res) => {
  try {
    // Görevleri kolon ve sıraya göre getir
    const tasks = db
      .prepare(
        `SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.column_name as columnName,
          t.order_index as orderIndex,
          t.owner_id as ownerId,
          t.created_by as createdBy,
          t.created_at as createdAt,
          t.updated_at as updatedAt,
          u.email as ownerEmail
        FROM tasks t
        LEFT JOIN users u ON t.owner_id = u.id
        ORDER BY t.column_name, t.order_index ASC`
      )
      .all();
    
    res.json(tasks);
  } catch (err) {
    console.error("[GET /tasks] Hata:", err);
    res.status(500).json({ error: "Görevler alınamadı." });
  }
});

// Yeni görev oluştur
router.post("/", requireAuth, (req, res) => {
  try {
    const { title, description, columnName, ownerId } = req.body;
    const createdBy = req.userId;
    
    // Validasyon
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Görev başlığı gerekli." });
    }
    
    // Görev ID oluştur
    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = Date.now();
    
    // Son sıra numarasını bul
    const lastTask = db
      .prepare("SELECT MAX(order_index) as maxIndex FROM tasks WHERE column_name = ?")
      .get(columnName || "todo");
    
    const orderIndex = (lastTask?.maxIndex ?? -1) + 1;
    
    // Görev oluştur
    db.prepare(
      `INSERT INTO tasks 
       (id, title, description, status, column_name, order_index, owner_id, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      taskId,
      title.trim(),
      description?.trim() || null,
      columnName || "todo",
      columnName || "todo",
      orderIndex,
      ownerId || null,
      createdBy,
      now,
      now
    );
    
    // Oluşturulan görevi döndür
    const createdTask = db
      .prepare(
        `SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.column_name as columnName,
          t.order_index as orderIndex,
          t.owner_id as ownerId,
          t.created_by as createdBy,
          t.created_at as createdAt,
          t.updated_at as updatedAt,
          u.email as ownerEmail
        FROM tasks t
        LEFT JOIN users u ON t.owner_id = u.id
        WHERE t.id = ?`
      )
      .get(taskId);
    
    res.json(createdTask);
  } catch (err) {
    console.error("[POST /tasks] Hata:", err);
    res.status(500).json({ error: "Görev oluşturulamadı." });
  }
});

// Görevi güncelle (başlık, açıklama, sorumlu, kolon değişikliği)
router.patch("/:id", requireAuth, (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, columnName, ownerId, orderIndex, status } = req.body;
    
    // Görevin var olduğunu kontrol et
    const task = db.prepare("SELECT id FROM tasks WHERE id = ?").get(taskId);
    if (!task) {
      return res.status(404).json({ error: "Görev bulunamadı." });
    }
    
    // Güncellenecek alanları hazırla
    const updates = [];
    const params = [];
    
    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title.trim());
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description?.trim() || null);
    }
    if (columnName !== undefined) {
      updates.push("column_name = ?");
      params.push(columnName);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
    }
    if (ownerId !== undefined) {
      updates.push("owner_id = ?");
      params.push(ownerId || null);
    }
    if (orderIndex !== undefined) {
      updates.push("order_index = ?");
      params.push(orderIndex);
    }
    
    // updated_at her zaman güncelle
    updates.push("updated_at = ?");
    params.push(Date.now());
    
    // Son parametre: task ID
    params.push(taskId);
    
    // Güncelleme yap
    db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(...params);
    
    // Güncellenmiş görevi döndür
    const updatedTask = db
      .prepare(
        `SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.column_name as columnName,
          t.order_index as orderIndex,
          t.owner_id as ownerId,
          t.created_by as createdBy,
          t.created_at as createdAt,
          t.updated_at as updatedAt,
          u.email as ownerEmail
        FROM tasks t
        LEFT JOIN users u ON t.owner_id = u.id
        WHERE t.id = ?`
      )
      .get(taskId);
    
    res.json(updatedTask);
  } catch (err) {
    console.error("[PATCH /tasks/:id] Hata:", err);
    res.status(500).json({ error: "Görev güncellenemedi." });
  }
});

// Görevi sil
router.delete("/:id", requireAuth, (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Görevin var olduğunu kontrol et
    const task = db.prepare("SELECT id FROM tasks WHERE id = ?").get(taskId);
    if (!task) {
      return res.status(404).json({ error: "Görev bulunamadı." });
    }
    
    // Sil
    db.prepare("DELETE FROM tasks WHERE id = ?").run(taskId);
    
    res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /tasks/:id] Hata:", err);
    res.status(500).json({ error: "Görev silinemedi." });
  }
});

// Görevlerin sıralamasını toplu güncelle (drag-drop için)
router.post("/reorder", requireAuth, (req, res) => {
  try {
    const { tasks } = req.body; // [{id, columnName, orderIndex}, ...]
    
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: "Geçersiz veri formatı." });
    }
    
    const now = Date.now();
    
    // Transaction benzeri: tüm güncellemeleri yap
    const stmt = db.prepare(
      "UPDATE tasks SET column_name = ?, order_index = ?, updated_at = ? WHERE id = ?"
    );
    
    for (const task of tasks) {
      stmt.run(task.columnName, task.orderIndex, now, task.id);
    }
    
    res.json({ ok: true, updated: tasks.length });
  } catch (err) {
    console.error("[POST /tasks/reorder] Hata:", err);
    res.status(500).json({ error: "Görevler yeniden sıralanamadı." });
  }
});

export default router;
