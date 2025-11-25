import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalendarEntry, EntryStatus } from "@/lib/types";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  event?: CalendarEntry | null;
  selectedDate: string;
}

export interface EventFormData {
  date: string;
  time: string;
  text: string;
  note: string;
  status: EntryStatus;
}

// Etkinlik ekleme/düzenleme modalı
const EventModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  event,
  selectedDate,
}: EventModalProps) => {
  const isEditing = !!event;

  // Form state'leri
  const [time, setTime] = useState("");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<EntryStatus>("planned");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal açıldığında veya event değiştiğinde formu doldur
  useEffect(() => {
    if (event) {
      setTime(event.time || "");
      setText(event.text || "");
      setNote(event.note || "");
      setStatus(event.status || "planned");
    } else {
      // Yeni etkinlik için formu sıfırla
      setTime("");
      setText("");
      setNote("");
      setStatus("planned");
    }
  }, [event, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        date: selectedDate,
        time,
        text,
        note,
        status,
      });
      onClose();
    } catch (err) {
      console.error("Kaydetme hatası:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = window.confirm(
      "Bu etkinliği silmek istediğinizden emin misiniz?"
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      console.error("Silme hatası:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Etkinliği Düzenle" : "Yeni Etkinlik"}
          </DialogTitle>
          <DialogDescription>
            {selectedDate} tarihli etkinlik
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Başlık */}
          <div className="space-y-2">
            <label htmlFor="text" className="text-sm font-medium">
              Başlık / Açıklama
            </label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Etkinlik başlığı..."
            />
          </div>

          {/* Saat */}
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">
              Saat
            </label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Durum */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Durum</label>
            <Select value={status} onValueChange={(v) => setStatus(v as EntryStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planlandı</SelectItem>
                <SelectItem value="done">Tamamlandı</SelectItem>
                <SelectItem value="missed">Kaçırıldı</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Not */}
          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium">
              Not (opsiyonel)
            </label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ek notlar..."
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting || saving}
            >
              {deleting ? "Siliniyor..." : "Sil"}
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} disabled={saving || deleting}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={saving || deleting}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;

