
import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const COLOR_DESCRIPTION_DEFAULTS = {
  default: { label: "Açık pembe", description: "Varsayılan gün rengi" },
  white: { label: "Beyaz", description: "Genel içerikler" },
  black: { label: "Siyah", description: "Özel kampanyalar" },
  red: { label: "Kırmızı", description: "Airdrop günleri" },
  orange: { label: "Turuncu", description: "Video içerikleri" },
  yellow: { label: "Sarı", description: "Hediye saatleri" },
  amber: { label: "Kehribar", description: "Yayın hatırlatmaları" },
  green: { label: "Yeşil", description: "Önemli duyurular" },
  emerald: { label: "Zümrüt", description: "B2B etkinlikleri" },
  cyan: { label: "Turkuaz", description: "Eğitim içerikleri" },
  sky: { label: "Açık mavi", description: "USDT etkinlikleri" },
  blue: { label: "Mavi", description: "Topluluk canlı yayınları" },
  purple: { label: "Mor", description: "Influencer iş birlikleri" },
  violet: { label: "Menekşe", description: "Özel seri" },
  pink: { label: "Pembe", description: "Kadın topluluğu içerikleri" },
  rose: { label: "Pudra", description: "PR paylaşımları" },
  gray: { label: "Gri", description: "Hazırlık aşamasında" }
};

const COLOR_DESCRIPTION_KEYS = Object.keys(COLOR_DESCRIPTION_DEFAULTS);

router.get("/", requireAuth, (req, res) => {
  // Tüm kullanıcıların kartlarını döndür - kullanıcı filtresi yok
  const rows = db
    .prepare("SELECT * FROM entries")
    .all();
  res.json(rows);
});

router.get("/highlights", requireAuth, (req, res) => {
  // Tüm kullanıcıların gün renklerini döndür - kullanıcı filtresi yok
  const rows = db
    .prepare("SELECT date, color FROM day_flags")
    .all();
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
    source: incomingSource,
    color = "",
    note = "",
    checkedAt = null,
    ownerId = null
  } = req.body;

  const source = incomingSource || "manual";
  const entryColor = color || "";
  const normalizedStatus =
    status === "done" || status === "missed" ? status : "planned";
  const noteValue = typeof note === "string" ? note : "";
  const checkedAtValue =
    normalizedStatus === "planned"
      ? null
      : typeof checkedAt === "string"
      ? checkedAt
      : new Date().toISOString();
  const ownerIdValue = resolveOwnerId(ownerId);

  const insertStmt = db.prepare(`
    INSERT INTO entries (user_id, date, time, text, files, communication, communication_type, platforms, source, color, note, status, checked_at, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertStmt.run(
    req.userId,
    date,
    time,
    text,
    files,
    communication,
    communicationType,
    JSON.stringify(platforms),
    source,
    entryColor,
    noteValue,
    normalizedStatus,
    checkedAtValue,
    ownerIdValue
  );

  const inserted = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(result.lastInsertRowid, req.userId);
  res.json(inserted);
});

router.post("/highlights", requireAuth, (req, res) => {
  const { date, color } = req.body || {};
  if (!date || typeof date !== "string") {
    return res.status(400).json({ error: "Tarih gerekli." });
  }
  const normalizedDate = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    return res.status(400).json({ error: "Tarih formatı geçersiz." });
  }
  const highlightColor =
    color && typeof color === "string" && color.trim()
      ? color.trim()
      : "#fee2e2";

  db.prepare(
    `INSERT INTO day_flags (user_id, date, color)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, date) DO UPDATE SET color = excluded.color`
  ).run(req.userId, normalizedDate, highlightColor);

  const saved = db
    .prepare("SELECT date, color FROM day_flags WHERE user_id = ? AND date = ?")
    .get(req.userId, normalizedDate);
  res.json(saved);
});

router.get("/color-descriptions", requireAuth, (_req, res) => {
  const rows = db
    .prepare("SELECT key, label, description FROM color_descriptions")
    .all();
  const merged = {};
  COLOR_DESCRIPTION_KEYS.forEach((key) => {
    merged[key] = { ...COLOR_DESCRIPTION_DEFAULTS[key] };
  });
  rows.forEach((row) => {
    if (!merged[row.key]) return;
    merged[row.key] = {
      label: row.label || COLOR_DESCRIPTION_DEFAULTS[row.key].label,
      description:
        typeof row.description === "string"
          ? row.description
          : COLOR_DESCRIPTION_DEFAULTS[row.key].description
    };
  });
  res.json(merged);
});

router.put("/color-descriptions", requireAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Bu işlem için admin yetkisi gerekir." });
  }
  const payload = req.body && req.body.descriptions;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res.status(400).json({ error: "Geçersiz veri." });
  }

  const upsertStmt = db.prepare(`
    INSERT INTO color_descriptions (key, label, description)
    VALUES (@key, @label, @description)
    ON CONFLICT(key) DO UPDATE SET label = excluded.label, description = excluded.description
  `);
  const deleteStmt = db.prepare("DELETE FROM color_descriptions WHERE key = ?");

  const rowsToApply = [];
  Object.entries(payload).forEach(([key, value]) => {
    if (!COLOR_DESCRIPTION_KEYS.includes(key)) return;
    const defaultRow = COLOR_DESCRIPTION_DEFAULTS[key];
    const label = (value && typeof value.label === "string" ? value.label : "")
      .trim()
      .slice(0, 60);
    const description = (value && typeof value.description === "string"
      ? value.description
      : ""
    )
      .trim()
      .slice(0, 200);
    const finalLabel = label || defaultRow.label;
    const finalDescription = description || "";
    rowsToApply.push({
      key,
      label: finalLabel,
      description: finalDescription
    });
  });

  const transaction = db.transaction((rows) => {
    rows.forEach((row) => {
      const defaultRow = COLOR_DESCRIPTION_DEFAULTS[row.key];
      if (
        row.label === defaultRow.label &&
        row.description.trim() === defaultRow.description.trim()
      ) {
        deleteStmt.run(row.key);
      } else {
        upsertStmt.run(row);
      }
    });
  });

  transaction(rowsToApply);

  res.json({ ok: true });
});

router.put("/:id", requireAuth, (req, res) => {
  const entryId = Number(req.params.id);
  if (!Number.isInteger(entryId)) {
    return res.status(400).json({ error: "Geçersiz kayıt kimliği." });
  }

  // Kayıt var mı kontrol et (kullanıcı filtresi yok - herkes düzenleyebilir)
  const existing = db.prepare("SELECT * FROM entries WHERE id = ?").get(entryId);

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
    source = existing.source || "manual",
    color = existing.color || "",
    note = existing.note || "",
    checkedAt = existing.checked_at || existing.checkedAt || null,
    ownerId = existing.owner_id || existing.ownerId || null
  } = req.body;
  const entryColor = color || "";
  const normalizedStatus =
    status === "done" || status === "missed" ? status : "planned";
  const noteValue = typeof note === "string" ? note : "";
  const checkedAtValue =
    normalizedStatus === "planned"
      ? null
      : typeof checkedAt === "string"
      ? checkedAt
      : new Date().toISOString();
  const ownerIdValue = resolveOwnerId(ownerId);

  // Admin herhangi bir kaydı güncelleyebilir, normal kullanıcı zaten yukarıda kontrol edildi
  db.prepare(`
    UPDATE entries
    SET date = ?, time = ?, text = ?, files = ?, communication = ?, communication_type = ?, platforms = ?, source = ?, color = ?, note = ?, status = ?, checked_at = ?, owner_id = ?
    WHERE id = ?
  `).run(
    date,
    time,
    text,
    files,
    communication,
    communicationType,
    JSON.stringify(platforms),
    source,
    entryColor,
    noteValue,
    normalizedStatus,
    checkedAtValue,
    ownerIdValue,
    entryId
  );

  const updated = db
    .prepare("SELECT * FROM entries WHERE id = ?")
    .get(entryId);
  res.json(updated);
});

router.delete("/reset", requireAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Takvimi yalnızca adminler sıfırlayabilir." });
  }

  const allowedScopes = new Set(["excel", "manual", "all", "highlights"]);
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

  let deletedEntries = 0;
  if (scope !== "highlights") {
    const filter = clauses[scope];
    // Admin TÜM kullanıcıların kayıtlarını siler
    const stmt = db.prepare(
      `DELETE FROM entries WHERE ${filter}`
    );
    const info = stmt.run();
    deletedEntries = info.changes || 0;
  }

  let deletedHighlights = 0;
  if (scope === "highlights" || scope === "all") {
    // Admin TÜM kullanıcıların gün renklerini siler
    const info = db
      .prepare("DELETE FROM day_flags")
      .run();
    deletedHighlights = info.changes || 0;
  }

  res.json({ ok: true, scope, deletedEntries, deletedHighlights });
});

router.delete("/highlights/:date", requireAuth, (req, res) => {
  const dateParam = (req.params.date || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return res.status(400).json({ error: "Geçersiz tarih formatı." });
  }
  const info = db
    .prepare("DELETE FROM day_flags WHERE user_id = ? AND date = ?")
    .run(req.userId, dateParam);
  res.json({ ok: true, deleted: info.changes });
});

router.delete("/:id", requireAuth, (req, res) => {
  const entryId = Number(req.params.id);
  if (!Number.isInteger(entryId)) {
    return res.status(400).json({ error: "Geçersiz kayıt kimliği." });
  }

  // Kaydı sil (kullanıcı filtresi yok - herkes silebilir)
  const info = db.prepare("DELETE FROM entries WHERE id = ?").run(entryId);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Kayıt bulunamadı." });
  }

  res.json({ ok: true });
});

export default router;
function resolveOwnerId(ownerId) {
  if (ownerId === undefined || ownerId === null || ownerId === "") return null;
  const parsed = Number(ownerId);
  if (!Number.isInteger(parsed)) return null;
  const row = db
    .prepare("SELECT id FROM users WHERE id = ? AND approved = 1")
    .get(parsed);
  return row ? parsed : null;
}
