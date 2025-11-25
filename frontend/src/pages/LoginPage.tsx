import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Router üzerinden yönlendirme yapmak için
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(
        "Login isteği backend'e gitti. Detaylar için konsolu kontrol et."
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { email, password },
        {
          // Şimdilik cookie vs göndermiyoruz
          withCredentials: false,
        }
      );

      console.log("Login cevabı:", response.data);

      const { token, user } = response.data;

      // 🔹 Token ve kullanıcı bilgisini tarayıcıya kaydediyoruz
      localStorage.setItem("pt_token", token);
      localStorage.setItem("pt_user", JSON.stringify(user));

      // 🔹 Artık alert yerine direkt takvim sayfasına yönlendiriyoruz
      navigate("/calendar", { replace: true });
    } catch (error) {
      console.error("Login hatası:", error);
      alert(
        "Giriş sırasında bir hata oluştu. E-posta / şifreyi veya CORS ayarlarını kontrol et."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">
          Paylaşım Takvimi
        </h1>
        <p className="text-sm text-slate-500 text-center">
          Lütfen giriş yapın
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">E-posta</label>
            <input
              type="email"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Şifre</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 text-white py-2 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;