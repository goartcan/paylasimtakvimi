import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// 404 sayfası
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-slate-300">404</h1>
        <h2 className="text-xl font-semibold text-slate-700">
          Sayfa Bulunamadı
        </h2>
        <p className="text-sm text-slate-500">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/calendar">Takvime Dön</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

