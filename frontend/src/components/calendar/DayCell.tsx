import type { CalendarEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface DayCellProps {
  day: number;
  dateKey: string;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEntry[];
  highlightColor?: string;
  onClick: () => void;
}

// Tek bir gün hücresi
const DayCell = ({
  day,
  isToday,
  isSelected,
  events,
  highlightColor,
  onClick,
}: DayCellProps) => {
  const eventCount = events.length;

  return (
    <div
      onClick={onClick}
      className={`
        min-h-[80px] p-2 rounded-lg cursor-pointer transition-all
        ${isToday ? "ring-2 ring-blue-500" : ""}
        ${isSelected ? "bg-blue-50 border-blue-300" : "bg-white border-slate-200"}
        ${highlightColor ? "" : ""}
        border hover:shadow-md
      `}
      style={highlightColor ? { backgroundColor: highlightColor } : undefined}
    >
      {/* Gün numarası */}
      <div
        className={`
          text-sm font-medium mb-1
          ${isToday ? "text-blue-600" : "text-slate-700"}
        `}
      >
        {day}
      </div>

      {/* Etkinlik sayısı ve özeti */}
      {eventCount > 0 && (
        <div className="space-y-1">
          <Badge variant="secondary" className="text-xs">
            {eventCount} içerik
          </Badge>
          {/* İlk 2 etkinliğin başlığını göster */}
          {events.slice(0, 2).map((event) => (
            <div
              key={event.id}
              className="text-xs text-slate-600 truncate"
              title={event.text}
            >
              {event.text || "-"}
            </div>
          ))}
          {eventCount > 2 && (
            <div className="text-xs text-slate-400">
              +{eventCount - 2} daha
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCell;

