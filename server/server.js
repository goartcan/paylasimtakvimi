import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import authRoutes from "./routes/auth.js";
import calendarRoutes from "./routes/calendar.js";
import importRoutes from "./routes/import.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

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

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/auth", authRoutes);
app.use("/calendar", calendarRoutes);
app.use("/import", importRoutes);
app.use("/users", usersRoutes);

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Paylaşım Takvimi API" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
