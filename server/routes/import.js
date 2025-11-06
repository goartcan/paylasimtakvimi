import express from "express";
import xlsx from "xlsx";
import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const BASE_MECRE_TO_PLATFORMS = {
  "instagram feed": ["Instagram Post", "Instagram Story"],
  "instagram carousel": ["Instagram Post"],
  "instagram post": ["Instagram Post"],
  "instagram story": ["Instagram Story"],
  "instagram reels": ["Instagram Reels"],
  "instagram reel": ["Instagram Reels"],
  "instagram": ["Instagram Post", "Instagram Story"],
  "twitter": ["X"],
  "twitter thread": ["X"],
  "twitter spaces": ["X"],
  "x": ["X"],
  "telegram": ["Telegram"],
  "tiktok": ["TikTok"],
  "youtube": ["YouTube"],
  "linkedin": ["LinkedIn"],
  "linkedin post": ["LinkedIn"],
  "linkedin article": ["LinkedIn"],
  "blog": ["Website", "Medium"],
  "medium": ["Medium"],
  "website": ["Website"],
  "web": ["Website"],
  "landing page": ["Website"],
  "landing": ["Website"],
  "discord": ["Discord"],
  "reddit": ["Reddit"],
  "facebook": ["Facebook"]
};

function mapMecraToPlatforms(value, unmatchedSet) {
  if (!value) {
    return [];
  }

  const platforms = new Set();
  const register = (arr) => {
    arr.forEach((platform) => platforms.add(platform));
  };

  const addFromKeyword = (token) => {
    const key = token.toLowerCase();
    const directMatch = BASE_MECRE_TO_PLATFORMS[key];
    if (directMatch) {
      register(directMatch);
      return true;
    }

    let matched = false;
    if (key.includes("instagram")) {
      if (key.includes("story")) {
        platforms.add("Instagram Story");
        matched = true;
      }
      if (key.includes("reel")) {
        platforms.add("Instagram Reels");
        matched = true;
      }
      if (key.includes("post") || key.includes("feed") || key.includes("carousel") || key.includes("organik")) {
        platforms.add("Instagram Post");
        matched = true;
      }
      if (!matched) {
        platforms.add("Instagram Post");
        platforms.add("Instagram Story");
        matched = true;
      }
    } else if (key.includes("linkedin")) {
      platforms.add("LinkedIn");
      matched = true;
    } else if (key.includes("youtube")) {
      platforms.add("YouTube");
      matched = true;
    } else if (key.includes("tiktok")) {
      platforms.add("TikTok");
      matched = true;
    } else if (key.includes("facebook")) {
      platforms.add("Facebook");
      matched = true;
    } else if (key.includes("reddit")) {
      platforms.add("Reddit");
      matched = true;
    } else if (key.includes("discord")) {
      platforms.add("Discord");
      matched = true;
    } else if (key.includes("telegram")) {
      platforms.add("Telegram");
      matched = true;
    } else if (/\b(twitter|x)\b/.test(key)) {
      platforms.add("X");
      matched = true;
    } else if (key.includes("medium")) {
      platforms.add("Medium");
      matched = true;
    } else if (key.includes("blog")) {
      platforms.add("Medium");
      platforms.add("Website");
      matched = true;
    } else if (key.includes("landing") || key.includes("web")) {
      platforms.add("Website");
      matched = true;
    }

    if (!matched && unmatchedSet) {
      unmatchedSet.add(token.trim());
    }
    return matched;
  };

  const tokens = String(value)
    .split(/[,/&|+\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!tokens.length) {
    return [];
  }

  tokens.forEach((token) => addFromKeyword(token));

  return Array.from(platforms);
}

function excelDateToISO(value) {
  if (!value) return "";
  const base = new Date(Date.UTC(1899, 11, 30));
  const date = new Date(base.getTime() + value * 86400000);
  return date.toISOString().slice(0, 10);
}

function processWorkbook(filePath, userId) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets["Kasım - Genel"];
  if (!sheet) {
    throw new Error("\"Kasım - Genel\" sayfası bulunamadı.");
  }

  const rows = xlsx.utils.sheet_to_json(sheet, { raw: true });
  const insert = db.prepare(`
    INSERT INTO entries (user_id, date, time, text, files, communication, communication_type, status, platforms, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const unmapped = new Set();
  let importedCount = 0;
  let skippedUnmapped = 0;

  db.prepare(
    "DELETE FROM entries WHERE user_id = ? AND LOWER(COALESCE(source, '')) = 'excel'"
  ).run(userId);

  rows.forEach((row) => {
    const dateISO = excelDateToISO(row["Tarih"]);
    if (!dateISO) return;

    const mecraRaw = (row["Mecra"] || "").toString().trim();
    const platforms = mapMecraToPlatforms(mecraRaw, unmapped);
    const files = [row["Creative"], row["Örnek"]].filter(Boolean).join("\n");

    if (!platforms.length) {
      if (mecraRaw) {
        skippedUnmapped++;
        unmapped.add(mecraRaw);
      }
      return;
    }

    insert.run(
      userId,
      dateISO,
      "",
      row["İçerik / Aksiyon"] || "",
      files,
      row["İletişim"] || "",
      row["İletişim Türü"] || "",
      row["Durum"] || "",
      JSON.stringify(platforms),
      "excel"
    );

    importedCount++;
  });

  return {
    processed: rows.length,
    imported: importedCount,
    skippedUnmapped,
    unmappedMecra: Array.from(unmapped)
  };
}

router.post("/", requireAuth, (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: "Dosya yolu gerekli." });
  }

  try {
    const result = processWorkbook(filePath, req.userId);
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message || "İçe aktarma başarısız." });
  }
});

router.post("/upload", requireAuth, (req, res) => {
  const { filename, data } = req.body || {};
  if (!filename || !data) {
    return res.status(400).json({ error: "Geçerli bir dosya seç." });
  }

  const tempDir = path.join(os.tmpdir(), "paylasimtakvimi_uploads");
  fs.mkdirSync(tempDir, { recursive: true });

  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9_.-]/g, "_");
  const tempPath = path.join(
    tempDir,
    `${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safeName}`
  );

  try {
    const buffer = Buffer.from(data, "base64");
    fs.writeFileSync(tempPath, buffer);
    const result = processWorkbook(tempPath, req.userId);
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message || "Dosya yüklenemedi." });
  } finally {
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch (cleanupErr) {
      console.warn("Geçici dosya silinirken hata:", cleanupErr.message);
    }
  }
});

export default router;
