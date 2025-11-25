import { useMemo } from "react";
import type { CalendarEntry, DayHighlight } from "@/lib/types";
import {
  DAY_NAMES,
  MONTH_NAMES,
  formatDateKey,
  getFirstDayOfMonth,
  getDaysInMonth,
  isToday,
} from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import DayCell from "./DayCell";

interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEntry[];
  highlights: DayHighlight[];
  selectedDate: string | null;
  onDateSelect: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

// Ana takvim grid bileşeni
const CalendarGrid = ({
  year,
  month,
  events,
  highlights,
  selectedDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) => {
  // Etkinlikleri tarihe göre grupla
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    events.forEach((event) => {
      const existing = map.get(event.date) || [];
      existing.push(event);
      map.set(event.date, existing);
    });
    return map;
  }, [events]);

  // Highlight'ları tarihe göre map'le
  const highlightsByDate = useMemo(() => {
    const map = new Map<string, string>();
    highlights.forEach((h) => {
      map.set(h.date, h.color);
    });
    return map;
  }, [highlights]);

  // Ayın yapısını hesapla
  const firstDayOffset = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  // Grid için gün hücreleri oluştur
  const dayCells = useMemo(() => {
    const cells: (number | null)[] = [];

    // Ayın başındaki boşluklar
    for (let i = 0; i < firstDayOffset; i++) {
      cells.push(null);
    }

    // Ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }

    // Toplam 35 veya 42 hücreye tamamla (5 veya 6 satır)
    while (cells.length < 35) {
      cells.push(null);
    }
    if (cells.length > 35) {
      while (cells.length < 42) {
        cells.push(null);
      }
    }

    return cells;
  }, [firstDayOffset, daysInMonth]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Ay navigasyonu */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Button variant="outline" size="sm" onClick={onPrevMonth}>
          ← Önceki
        </Button>
        <h2 className="text-lg font-semibold text-slate-800">
          {MONTH_NAMES[month]} {year}
        </h2>
        <Button variant="outline" size="sm" onClick={onNextMonth}>
          Sonraki →
        </Button>
      </div>

      {/* Gün isimleri */}
      <div className="grid grid-cols-7 gap-1 px-2 py-2 bg-slate-50">
        {DAY_NAMES.map((dayName) => (
          <div
            key={dayName}
            className="text-xs font-medium text-slate-500 text-center py-2"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Takvim grid'i */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {dayCells.map((day, index) => {
          if (day === null) {
            // Boş hücre
            return <div key={`empty-${index}`} className="min-h-[80px]" />;
          }

          const dateKey = formatDateKey(new Date(year, month, day));
          const dayEvents = eventsByDate.get(dateKey) || [];
          const highlightColor = highlightsByDate.get(dateKey);

          return (
            <DayCell
              key={dateKey}
              day={day}
              dateKey={dateKey}
              isToday={isToday(year, month, day)}
              isSelected={selectedDate === dateKey}
              events={dayEvents}
              highlightColor={highlightColor}
              onClick={() => onDateSelect(dateKey)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
