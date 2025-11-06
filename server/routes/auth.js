import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_me";
const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre gerekli." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isAdmin = adminEmails.includes(normalizedEmail);
  const role = isAdmin ? "admin" : "user";
  const approved = isAdmin ? 1 : 0;

  const hash = bcrypt.hashSync(password, 10);
  try {
    db.prepare(
      "INSERT INTO users (email, password_hash, role, approved) VALUES (?, ?, ?, ?)"
    ).run(normalizedEmail, hash, role, approved);
    res.json({ ok: true, approved: Boolean(approved), role });
  } catch (err) {
    res.status(400).json({ error: "Email zaten kayıtlı olabilir." });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || "").trim().toLowerCase();
  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(normalizedEmail);
  if (!user) return res.status(401).json({ error: "Geçersiz bilgiler." });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Geçersiz bilgiler." });

  if (!user.approved) {
    return res.status(403).json({
      error: "Hesabın onay bekliyor. Admin onayından sonra giriş yapabilirsin."
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  const userInfo = {
    id: user.id,
    email: user.email,
    role: user.role,
    approved: Boolean(user.approved)
  };
  res.json({ token, user: userInfo });
});

router.get("/me", requireAuth, (req, res) => {
  const { id, email, role, approved } = req.user;
  res.json({ id, email, role, approved: Boolean(approved) });
});

export default router;
