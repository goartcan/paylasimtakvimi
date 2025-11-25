// Etkinlik durumu
export type EntryStatus = "planned" | "done" | "missed";

// Backend'den dönen etkinlik verisi
export interface CalendarEntry {
  id: number;
  user_id: number;
  date: string;           // "YYYY-MM-DD" formatında
  time: string;
  text: string;
  files: string;
  communication: string;
  communication_type: string;
  platforms: string;      // JSON stringified array
  source: string;         // "manual" | "excel"
  color: string;
  note: string;
  status: EntryStatus;
  checked_at: string | null;
  owner_id: number | null;
}

// Gün renklendirme verisi
export interface DayHighlight {
  date: string;
  color: string;
}

// Yeni etkinlik oluşturma için payload
export interface CreateEntryPayload {
  date: string;
  time?: string;
  text?: string;
  files?: string;
  communication?: string;
  communicationType?: string;
  status?: EntryStatus;
  platforms?: string[];
  source?: string;
  color?: string;
  note?: string;
  checkedAt?: string | null;
  ownerId?: number | null;
}

// Etkinlik güncelleme için payload
export interface UpdateEntryPayload {
  date?: string;
  time?: string;
  text?: string;
  files?: string;
  communication?: string;
  communicationType?: string;
  status?: EntryStatus;
  platforms?: string[];
  source?: string;
  color?: string;
  note?: string;
  checkedAt?: string | null;
  ownerId?: number | null;
}

// Platform listesini parse eden yardımcı fonksiyon
export function parsePlatforms(platformsStr: string): string[] {
  if (!platformsStr) return [];
  try {
    return JSON.parse(platformsStr) as string[];
  } catch {
    return [];
  }
}

