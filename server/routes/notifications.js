import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Kullanıcının tüm bildirimlerini getir
router.get("/", requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    console.log(`[GET /notifications] Bildirimler isteniyor (user_id: ${userId})`);
    
    const notifications = db
      .prepare(
        `SELECT 
          id,
          title,
          message,
          share_id as shareId,
          card_id as cardId,
          day_key as dayKey,
          from_email as from,
          is_read as isRead,
          created_at as createdAt
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 100`
      )
      .all(userId);
    
    console.log(`[GET /notifications] ${notifications.length} bildirim döndürülüyor`);
    
    // is_read'i boolean'a çevir
    const formatted = notifications.map((n) => ({
      ...n,
      isRead: Boolean(n.isRead),
      createdAt: Number(n.createdAt)
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error("[GET /notifications] Hata:", err);
    console.error("[GET /notifications] Hata detayı:", err.stack);
    res.status(500).json({ error: "Bildirimler alınamadı." });
  }
});

// Yeni bildirim oluştur (başka bir kullanıcı için)
router.post("/", requireAuth, (req, res) => {
  try {
    const { targetUserEmail, title, message, shareId, cardId, dayKey } = req.body;
    
    // Hedef kullanıcıyı bul
    const targetUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(targetUserEmail);
    
    if (!targetUser) {
      return res.status(404).json({ error: "Hedef kullanıcı bulunamadı." });
    }
    
    // Bildirim oluştur
    const notificationId = `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = Date.now();
    const fromEmail = req.user.email;
    
    db.prepare(
      `INSERT INTO notifications 
       (id, user_id, title, message, share_id, card_id, day_key, from_email, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`
    ).run(
      notificationId,
      targetUser.id,
      title || "Yeni içerik",
      message || "",
      shareId || null,
      cardId || null,
      dayKey || null,
      fromEmail,
      createdAt
    );
    
    res.json({
      id: notificationId,
      userId: targetUser.id,
      title,
      message,
      shareId: shareId || null,
      cardId: cardId || null,
      dayKey: dayKey || null,
      from: fromEmail,
      isRead: false,
      createdAt
    });
  } catch (err) {
    console.error("[POST /notifications] Hata:", err);
    res.status(500).json({ error: "Bildirim oluşturulamadı." });
  }
});

// Bildirimi okundu olarak işaretle
router.patch("/:id/read", requireAuth, (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;
    
    // Bildirimin bu kullanıcıya ait olduğunu kontrol et
    const notification = db
      .prepare("SELECT id FROM notifications WHERE id = ? AND user_id = ?")
      .get(notificationId, userId);
    
    if (!notification) {
      return res.status(404).json({ error: "Bildirim bulunamadı." });
    }
    
    // Okundu olarak işaretle
    db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ?").run(notificationId);
    
    res.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /notifications/:id/read] Hata:", err);
    res.status(500).json({ error: "Bildirim güncellenemedi." });
  }
});

// Tüm bildirimleri okundu olarak işaretle
router.post("/mark-all-read", requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    
    const result = db
      .prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0")
      .run(userId);
    
    res.json({ ok: true, updated: result.changes });
  } catch (err) {
    console.error("[POST /notifications/mark-all-read] Hata:", err);
    res.status(500).json({ error: "Bildirimler güncellenemedi." });
  }
});

export default router;

