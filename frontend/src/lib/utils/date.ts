// Tarih ile ilgili yardımcı fonksiyonlar

// Türkçe ay isimleri
export const MONTH_NAMES = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

// Türkçe gün isimleri (Pazartesi'den başlayarak)
export const DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Date objesini YYYY-MM-DD formatına çevir
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Ayın ilk gününün haftanın kaçıncı günü olduğunu bul (0 = Pazartesi)
export function getFirstDayOfMonth(year: number, month: number): number {
  const firstDay = new Date(year, month, 1);
  // JS'de 0 = Pazar, biz Pazartesi başlangıç istiyoruz
  return (firstDay.getDay() + 6) % 7;
}

// Ayda kaç gün var
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Bugün mü kontrolü
export function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

// Tarihi okunabilir formata çevir: "25 Kasım 2025"
export function formatDateReadable(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
}

