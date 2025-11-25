import { useNavigate } from "react-router-dom";

// Basit takvim sayfası taslağı.
// Şimdilik sadece giriş yapıldığını ve kullanıcının epostasını gösteriyoruz.

const CalendarPage = () => {
  const navigate = useNavigate();

  // localStorage'dan kullanıcı bilgisini almaya çalışıyoruz
  const userRaw = localStorage.getItem("pt_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // Çıkış (logout) butonuna basıldığında çalışacak fonksiyon
  const handleLogout = () => {
    // Token ve kullanıcı bilgisini temizliyoruz
    localStorage.removeItem("pt_token");
    localStorage.removeItem("pt_user");

    // Kullanıcıyı login sayfasına yönlendiriyoruz
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="bg-white shadow rounded-xl p-6 space-y-3 min-w-[320px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Takvim</h1>
            <p className="text-sm text-slate-600">
              Giriş yaptın. Burası takvim sayfasının taslak (placeholder) ekranı.
            </p>
            {user && (
              <p className="text-xs text-slate-500 mt-1">
                Aktif kullanıcı:{" "}
                <span className="font-mono">{user.email}</span>
              </p>
            )}
          </div>

          {/* Sağ üstte Çıkış butonu */}
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-100"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;