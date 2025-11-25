import AppShell from "@/components/layout/AppShell";

// Dashboard sayfası iskeleti
// Phase 1'de basit bir placeholder, Phase 2'de istatistikler eklenecek
const DashboardPage = () => {
  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Paylaşım takvimi genel görünümü
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            Bu sayfa henüz taslak aşamasında. Phase 1 tamamlandığında buraya
            istatistikler ve özet bilgiler eklenecek.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default DashboardPage;

