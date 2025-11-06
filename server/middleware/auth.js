import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "change_me";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token gerekli." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db
      .prepare("SELECT id, email, role, approved FROM users WHERE id = ?")
      .get(decoded.userId);
    if (!user) return res.status(401).json({ error: "Kullanıcı bulunamadı." });
    if (!user.approved) {
      return res.status(403).json({ error: "Hesabın onay bekliyor." });
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch (err) {
    console.warn("Auth hatası:", err.message);
    res.status(401).json({ error: "Token geçersiz." });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Yalnızca adminler bu işlemi yapabilir." });
}
