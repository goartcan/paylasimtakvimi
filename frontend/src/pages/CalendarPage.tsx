import { useState, useEffect, useMemo, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventModal, { type EventFormData } from "@/components/calendar/EventModal";
import {
  getEvents,
  getHighlights,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/api/calendar";
import type { CalendarEntry, DayHighlight } from "@/lib/types";
import { formatDateReadable } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Takvim sayfası
const CalendarPage = () => {
  // Mevcut ay/yıl state'i
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Seçili gün
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Veri state'leri
  const [events, setEvents] = useState<CalendarEntry[]>([]);
  const [highlights, setHighlights] = useState<DayHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state'leri
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEntry | null>(null);

  // Verileri yükle
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsData, highlightsData] = await Promise.all([
        getEvents(),
        getHighlights(),
      ]);

      setEvents(eventsData);
      setHighlights(highlightsData);
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Önceki ay
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // Sonraki ay
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Seçili güne ait etkinlikler
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  // Yeni etkinlik ekle
  const handleAddEvent = () => {
    if (!selectedDate) return;
    setEditingEvent(null);
    setModalOpen(true);
  };

  // Etkinlik düzenle
  const handleEditEvent = (event: CalendarEntry) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  // Etkinlik kaydet (yeni veya güncelleme)
  const handleSaveEvent = async (data: EventFormData) => {
    if (editingEvent) {
      // Güncelleme
      await updateEvent(editingEvent.id, {
        date: data.date,
        time: data.time,
        text: data.text,
        note: data.note,
        status: data.status,
      });
    } else {
      // Yeni ekleme
      await createEvent({
        date: data.date,
        time: data.time,
        text: data.text,
        note: data.note,
        status: data.status,
      });
    }
    // Verileri yeniden yükle
    await fetchData();
  };

  // Etkinlik sil
  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
    await deleteEvent(editingEvent.id);
    await fetchData();
  };

  // Modal kapat
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  // Durum badge'i için variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "done":
        return "default";
      case "missed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Durum metni
  const getStatusText = (status: string) => {
    switch (status) {
      case "done":
        return "Tamamlandı";
      case "missed":
        return "Kaçırıldı";
      default:
        return "Planlandı";
    }
  };

  return (
    <AppShell title="Takvim">
      <div className="space-y-6">
        {/* Yüklenme durumu */}
        {loading && (
          <div className="text-center py-8 text-slate-500">
            Veriler yükleniyor...
          </div>
        )}

        {/* Hata durumu */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Takvim ve detay paneli */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Takvim grid'i */}
            <div className="lg:col-span-2">
              <CalendarGrid
                year={currentYear}
                month={currentMonth}
                events={events}
                highlights={highlights}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            </div>

            {/* Seçili gün detayları */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">
                    {selectedDate
                      ? formatDateReadable(selectedDate)
                      : "Bir gün seçin"}
                  </CardTitle>
                  {selectedDate && (
                    <Button size="sm" onClick={handleAddEvent}>
                      + Ekle
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedDate && (
                    <p className="text-sm text-slate-500">
                      Detayları görmek için takvimden bir gün seçin.
                    </p>
                  )}

                  {selectedDate && selectedDayEvents.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Bu gün için etkinlik bulunmuyor.
                    </p>
                  )}

                  {selectedDate && selectedDayEvents.length > 0 && (
                    <div className="space-y-3">
                      {selectedDayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 bg-slate-50 rounded-lg border cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => handleEditEvent(event)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">
                                {event.text || "Başlıksız"}
                              </p>
                              {event.time && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Saat: {event.time}
                                </p>
                              )}
                            </div>
                            <Badge variant={getStatusBadgeVariant(event.status)}>
                              {getStatusText(event.status)}
                            </Badge>
                          </div>
                          {event.note && (
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                              {event.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Etkinlik modalı */}
        {selectedDate && (
          <EventModal
            open={modalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveEvent}
            onDelete={editingEvent ? handleDeleteEvent : undefined}
            event={editingEvent}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </AppShell>
  );
};

export default CalendarPage;
