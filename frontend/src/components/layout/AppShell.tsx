import type { ReactNode } from "react";

type AppShellProps = {
  title?: string;
  children: ReactNode;
};

// Bu bileşen, ileride tüm sayfaların kullanacağı temel iskelet olacak.
// Şimdilik sadece üstte başlık, altta içerik alanı var.
const AppShell = ({ title = "Paylaşım Takvimi", children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Üst bar */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <h1 className="text-base font-semibold">{title}</h1>
          <span className="text-[11px] text-slate-500">
            V2 – React + Vite (taslak)
          </span>
        </div>
      </header>

      {/* İçerik alanı */}
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
};

export default AppShell;