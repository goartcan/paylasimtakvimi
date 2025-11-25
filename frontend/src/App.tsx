import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";

const App = () => {
  // Kullanıcı giriş yapmış mı diye localStorage'dan token'a bakıyoruz
  const token = localStorage.getItem("pt_token");

  return (
    <Routes>
      {/* Login sayfası */}
      <Route path="/login" element={<LoginPage />} />

      {/* Takvim sayfası - sadece token varsa erişilsin */}
      <Route
        path="/calendar"
        element={token ? <CalendarPage /> : <Navigate to="/login" replace />}
      />

      {/* Ana rota (/) */}
      <Route
        path="/"
        element={
          token ? (
            // Eğer token varsa ana sayfaya gelince direkt takvime yönlendir
            <Navigate to="/calendar" replace />
          ) : (
            // Token yoksa ana sayfa login'e yönlendirsin
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;