import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      {/* Public route: Login sayfası */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes: Auth gerektirenler */}
      <Route
        path="/calendar"
        element={
          <RequireAuth>
            <CalendarPage />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />

      <Route
        path="/users"
        element={
          <RequireAuth>
            <UsersPage />
          </RequireAuth>
        }
      />

      <Route
        path="/settings"
        element={
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        }
      />

      {/* Ana rota: Takvime yönlendir */}
      <Route path="/" element={<Navigate to="/calendar" replace />} />

      {/* 404: Tanımsız rotalar */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
