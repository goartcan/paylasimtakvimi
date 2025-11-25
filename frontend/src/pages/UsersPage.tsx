import AppShell from "@/components/layout/AppShell";

// Kullanıcı yönetimi sayfası iskeleti
// Phase 1'de basit bir placeholder, sonra admin paneli eklenecek
const UsersPage = () => {
  return (
    <AppShell title="Kullanıcılar">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kullanıcılar</h1>
          <p className="text-sm text-slate-600 mt-1">
            Kullanıcı yönetimi ve onaylama işlemleri
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            Bu sayfa henüz taslak aşamasında. Phase 1 tamamlandığında buraya
            kullanıcı listesi ve yönetim araçları eklenecek.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default UsersPage;

