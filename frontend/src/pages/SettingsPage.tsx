import AppShell from "@/components/layout/AppShell";

// Ayarlar sayfası iskeleti
// Phase 1'de basit bir placeholder
const SettingsPage = () => {
  return (
    <AppShell title="Ayarlar">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ayarlar</h1>
          <p className="text-sm text-slate-600 mt-1">
            Uygulama ayarları ve tercihler
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            Bu sayfa henüz taslak aşamasında. Phase 1 tamamlandığında buraya
            renk açıklamaları ve tema ayarları eklenecek.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;

