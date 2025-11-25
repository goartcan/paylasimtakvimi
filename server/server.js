import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import authRoutes from "./routes/auth.js";
import calendarRoutes from "./routes/calendar.js";
import importRoutes from "./routes/import.js";
import usersRoutes from "./routes/users.js";
import notificationsRoutes from "./routes/notifications.js";
import tasksRoutes from "./routes/tasks.js";
import { runAutoMigrations } from "./utils/auto-migrate.js";

dotenv.config();

// Otomatik migration: Server her başladığında eksik kolonları kontrol et ve ekle
runAutoMigrations();

const adminSeedEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
if (adminSeedEmails.length) {
  try {
    const updateAdminStmt = db.prepare(
      "UPDATE users SET role = 'admin', approved = 1 WHERE email = ?"
    );
    adminSeedEmails.forEach((email) => {
      updateAdminStmt.run(email);
    });
  } catch (err) {
    console.warn("Admin hesaplarını güncellerken hata oluştu:", err.message);
  }
}

const app = express();

app.use(cors({
  origin: [
    "https://paylasimtakvimi.vercel.app", // YENİ: Vercel URL
    "https://paylasimtakvimi.netlify.app", // ESKİ: Netlify URL
    "http://localhost:8888",
    "http://127.0.0.1:8888",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://paylasimtakvimi.onrender.com",
    "http://localhost:5173" // 🔹 Vite dev server için
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/auth", authRoutes);
app.use("/calendar", calendarRoutes);
app.use("/import", importRoutes);
app.use("/users", usersRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/tasks", tasksRoutes);

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Paylaşım Takvimi API" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
