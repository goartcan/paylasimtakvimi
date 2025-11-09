import express from "express";
import db from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/approved", requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT id, email
      FROM users
      WHERE approved = 1
      ORDER BY email ASC
    `
    )
    .all();
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        u.id,
        u.email,
        u.role,
        u.approved,
        u.created_at,
        COUNT(e.id) AS entryCount
      FROM users u
      LEFT JOIN entries e ON e.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `
    )
    .all()
    .map((row) => ({
      ...row,
      approved: Boolean(row.approved),
      entryCount: Number(row.entryCount)
    }));
  res.json(rows);
});

router.post("/:id/approve", requireAuth, requireAdmin, (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı kimliği." });
  }

  const info = db
    .prepare("UPDATE users SET approved = 1 WHERE id = ?")
    .run(userId);
  if (info.changes === 0) {
    return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  }

  const user = db
    .prepare("SELECT id, email, role, approved FROM users WHERE id = ?")
    .get(userId);
  res.json({
    ...user,
    approved: Boolean(user.approved)
  });
});

router.post("/:id/reject", requireAuth, requireAdmin, (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı kimliği." });
  }

  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

  const deleteEntries = db.prepare("DELETE FROM entries WHERE user_id = ?");
  const deleteUser = db.prepare("DELETE FROM users WHERE id = ?");

  const tx = db.transaction(() => {
    deleteEntries.run(userId);
    deleteUser.run(userId);
  });
  tx();

  res.json({ ok: true });
});

router.post("/:id/role", requireAuth, requireAdmin, (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı kimliği." });
  }
  const { role } = req.body || {};
  if (!role || !["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Geçersiz rol." });
  }

  const info = db
    .prepare("UPDATE users SET role = ? WHERE id = ?")
    .run(role, userId);
  if (info.changes === 0) {
    return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  }

  const updated = db
    .prepare("SELECT id, email, role, approved FROM users WHERE id = ?")
    .get(userId);
  res.json({ ...updated, approved: Boolean(updated.approved) });
});

export default router;
