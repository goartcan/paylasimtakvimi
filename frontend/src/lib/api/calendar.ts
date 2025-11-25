import apiClient from "./client";
import type { CalendarEntry, DayHighlight, CreateEntryPayload, UpdateEntryPayload } from "../types/event";

// Backend: GET /calendar - Tüm etkinlikleri getir
export async function getEvents(): Promise<CalendarEntry[]> {
  const response = await apiClient.get<CalendarEntry[]>("/calendar");
  return response.data;
}

// Backend: GET /calendar/highlights - Gün renklerini getir
export async function getHighlights(): Promise<DayHighlight[]> {
  const response = await apiClient.get<DayHighlight[]>("/calendar/highlights");
  return response.data;
}

// Backend: POST /calendar - Yeni etkinlik ekle
export async function createEvent(payload: CreateEntryPayload): Promise<CalendarEntry> {
  const response = await apiClient.post<CalendarEntry>("/calendar", payload);
  return response.data;
}

// Backend: PUT /calendar/:id - Etkinlik güncelle
export async function updateEvent(id: number, payload: UpdateEntryPayload): Promise<CalendarEntry> {
  const response = await apiClient.put<CalendarEntry>(`/calendar/${id}`, payload);
  return response.data;
}

// Backend: DELETE /calendar/:id - Etkinlik sil
export async function deleteEvent(id: number): Promise<{ ok: boolean }> {
  const response = await apiClient.delete<{ ok: boolean }>(`/calendar/${id}`);
  return response.data;
}

// Backend: POST /calendar/highlights - Gün rengi ekle/güncelle
export async function setHighlight(date: string, color: string): Promise<DayHighlight> {
  const response = await apiClient.post<DayHighlight>("/calendar/highlights", { date, color });
  return response.data;
}

// Backend: DELETE /calendar/highlights/:date - Gün rengini sil
export async function deleteHighlight(date: string): Promise<{ ok: boolean; deleted: number }> {
  const response = await apiClient.delete<{ ok: boolean; deleted: number }>(`/calendar/highlights/${date}`);
  return response.data;
}

