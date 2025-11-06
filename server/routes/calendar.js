import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  let targetUserId = req.userId;
  if (req.user.role === "admin" && req.query.userId) {
    const requested = Number(req.query.userId);
    if (!Number.isInteger(requested)) {
      return res.status(400).json({ error: "Geçersiz kullanıcı kimliği." });
    }
    const targetUser = db
      .prepare("SELECT id FROM users WHERE id = ?")
      .get(requested);
    if (!targetUser) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }
    targetUserId = requested;
  } else if (req.query.userId && req.user.role !== "admin") {
    return res.status(403).json({ error: "Sadece adminler diğer kullanıcıları görüntüleyebilir." });
  }

  const rows = db
    .prepare("SELECT * FROM entries WHERE user_id = ?")
    .all(targetUserId);
  res.json(rows);
});

router.post("/", requireAuth, (req, res) => {
  const {
    date,
    time = "",
    text = "",
    files = "",
    communication = "",
    communicationType = "",
    status = "",
    platforms = [],
    source: incomingSource
  } = req.body;

  const source = incomingSource || "manual";

  const insertStmt = db.prepare(`
    INSERT INTO entries (user_id, date, time, text, files, communication, communication_type, status, platforms, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertStmt.run(
    req.userId,
    date,
    time,
    text,
    files,
    communication,
    communicationType,
    status,
    JSON.stringify(platforms),
    source
  );

  const inserted = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(result.lastInsertRowid, req.userId);
  res.json(inserted);
});

router.put("/:id", requireAuth, (req, res) => {
  const entryId = Number(req.params.id);
  if (!Number.isInteger(entryId)) {
    return res.status(400).json({ error: "Geçersiz kayıt kimliği." });
  }

  const existing = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(entryId, req.userId);
  if (!existing) {
    return res.status(404).json({ error: "Kayıt bulunamadı." });
  }

  const {
    date = existing.date,
    time = existing.time || "",
    text = existing.text || "",
    files = existing.files || "",
    communication = existing.communication || "",
    communicationType = existing.communication_type || "",
    status = existing.status || "",
    platforms = existing.platforms ? JSON.parse(existing.platforms) : [],
    source = existing.source || "manual"
  } = req.body;

  db.prepare(`
    UPDATE entries
    SET date = ?, time = ?, text = ?, files = ?, communication = ?, communication_type = ?, status = ?, platforms = ?, source = ?
    WHERE id = ? AND user_id = ?
  `).run(
    date,
    time,
    text,
    files,
    communication,
    communicationType,
    status,
    JSON.stringify(platforms),
    source,
    entryId,
    req.userId
  );

  const updated = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(entryId, req.userId);
  res.json(updated);
});

router.delete("/reset", requireAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Takvimi yalnızca adminler sıfırlayabilir." });
  }

  const allowedScopes = new Set(["excel", "manual", "all"]);
  const scopeRaw = (req.body && req.body.scope) || "all";
  const scope = String(scopeRaw).toLowerCase();

  if (!allowedScopes.has(scope)) {
    return res.status(400).json({ error: "Geçersiz sıfırlama kapsamı." });
  }

  const clauses = {
    excel: "LOWER(COALESCE(source, '')) = 'excel'",
    manual: "LOWER(COALESCE(source, '')) = 'manual'",
    all: "1=1"
  };

  const filter = clauses[scope];
  const stmt = db.prepare(
    `DELETE FROM entries WHERE user_id = ? AND ${filter}`
  );
  const info = stmt.run(req.userId);

  res.json({ ok: true, deleted: info.changes, scope });
});

router.delete("/:id", requireAuth, (req, res) => {
  const entryId = Number(req.params.id);
  if (!Number.isInteger(entryId)) {
    return res.status(400).json({ error: "Geçersiz kayıt kimliği." });
  }

  const info = db
    .prepare("DELETE FROM entries WHERE id = ? AND user_id = ?")
    .run(entryId, req.userId);
  if (info.changes === 0) {
    return res.status(404).json({ error: "Kayıt bulunamadı." });
  }

  res.json({ ok: true });
});

export default router;
