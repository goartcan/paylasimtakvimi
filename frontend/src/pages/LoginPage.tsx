import { FormEvent, useState } from "react";
import { loginRequest } from "../lib/api/auth";

function LoginPage() {
  // Kullanıcının girdiği e-posta ve şifreyi state'te tutuyoruz
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    // Formun sayfayı yeniden yüklemesini engelle
    event.preventDefault();

    // Basit doğrulama: boş bırakma
    if (!email.trim() || !password.trim()) {
      alert("Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Backend'e login isteği at
      const data = await loginRequest(email, password);

      console.log("Login cevabı:", data);
      alert("Login isteği backend'e gitti. Detaylar için konsolu kontrol et.");
    } catch (error: unknown) {
      console.error("Login hatası:", error);
      alert(
        "Giriş sırasında bir hata oluştu. Konsoldaki hata mesajına bakalım."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="max-w-sm w-full mx-4 rounded-xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Paylaşım Takvimi
        </h1>

        <p className="text-sm text-slate-300 text-center mb-4">
          Giriş ekranı – backend bağlantısı test aşamasında.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;