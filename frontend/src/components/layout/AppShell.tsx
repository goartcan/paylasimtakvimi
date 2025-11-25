import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getStoredUser } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  title?: string;
  children: ReactNode;
};

// Navigasyon linkleri
const navLinks = [
  { path: "/calendar", label: "Takvim" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/users", label: "Kullanıcılar" },
  { path: "/settings", label: "Ayarlar" },
];

// Bu bileşen tüm sayfaların kullandığı temel iskelet
const AppShell = ({ title = "Paylaşım Takvimi", children }: AppShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Üst bar */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <h1 className="text-base font-semibold">{title}</h1>
            
            {/* Navigasyon */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    location.pathname === link.path
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-xs text-slate-500">
                {user.email}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      {/* İçerik alanı */}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};

export default AppShell;
