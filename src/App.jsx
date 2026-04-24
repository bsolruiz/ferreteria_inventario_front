import { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { Toaster } from "react-hot-toast";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import InventarioPage from "./features/products/pages/InventarioPage";
import CrearProductoPage from "./features/products/pages/CrearProductoPage";
import ReportsScreen from "./features/reports/pages/ReportsScreen";
import MovimientosReportScreen from "./features/reports/pages/MovimientosReportScreen";
import MovementScreen from "./features/movimientos/pages/MovementScreen";
import UsersPage from "./features/users/pages/UsersPage";
import CrearUsuarioPage from "./features/users/pages/CrearUsuarioPage";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Helper: verifica si el usuario actual es admin
  const isAdmin = currentUser?.rolId === 1 || currentUser?.rolNombre === "Admin";

  const handleLogin = (usuario) => {
    setCurrentUser(usuario);
    localStorage.setItem("user", JSON.stringify(usuario));
    navigate("/inventario");
  };

  const handleNavegar = (pantalla) => {
    if (pantalla === "login") {
      setCurrentUser(null);
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    // Mapeo de nombres antiguos a rutas
    const routes = {
      inventario: "/inventario",
      "crear-producto": "/crear-producto",
      reports: "/reports",
      movimientos: "/movimientos",
      movimiento: "/movimiento",
      users: "/users",
      "crear-usuario": "/crear-usuario",
    };
    navigate(routes[pantalla] || `/${pantalla}`);
  };

  return (
    <div className="min-h-screen h-screen font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-slate-800 text-white border border-slate-700",
          style: {
            background: "#1e293b",
            color: "#fff",
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Routes location={location}>
            <Route
              path="/login"
              element={
                currentUser ? (
                  <Navigate to="/inventario" />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />

            <Route
              path="/inventario"
              element={
                currentUser ? (
                  <InventarioPage
                    onNavegar={handleNavegar}
                    currentUser={currentUser}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/crear-producto"
              element={
                currentUser ? (
                  <CrearProductoPage onNavegar={handleNavegar} currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/reports"
              element={
                currentUser ? (
                  <ReportsScreen
                    onNavigate={handleNavegar}
                    currentUser={currentUser}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/movimientos"
              element={
                currentUser ? (
                  <MovimientosReportScreen onNavigate={handleNavegar} currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/movimiento"
              element={
                currentUser ? (
                  <MovementScreen
                    onNavigate={handleNavegar}
                    currentUser={currentUser}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/users"
              element={
                !currentUser ? (
                  <Navigate to="/login" />
                ) : !isAdmin ? (
                  <Navigate to="/inventario" />
                ) : (
                  <UsersPage
                    onNavigate={handleNavegar}
                    currentUser={currentUser}
                  />
                )
              }
            />

            <Route
              path="/crear-usuario"
              element={
                !currentUser ? (
                  <Navigate to="/login" />
                ) : !isAdmin ? (
                  <Navigate to="/inventario" />
                ) : (
                  <CrearUsuarioPage
                    onNavigate={handleNavegar}
                    currentUser={currentUser}
                  />
                )
              }
            />

            <Route
              path="*"
              element={<Navigate to={currentUser ? "/inventario" : "/login"} />}
            />
          </Routes>
        </Motion.div>
      </AnimatePresence>
    </div>
  );
}
