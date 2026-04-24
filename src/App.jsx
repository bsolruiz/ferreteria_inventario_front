import { useState, useEffect } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import LoginPage from './features/auth/pages/LoginPage';
import InventarioPage from './features/products/pages/InventarioPage';
import CrearProductoPage from './features/products/pages/CrearProductoPage';
import ReportsScreen from './features/reports/pages/ReportsScreen';
import MovimientosReportScreen from './features/reports/pages/MovimientosReportScreen';
import MovementScreen from './features/movimientos/pages/MovementScreen';
import UsersPage from './features/users/pages/UsersPage';
import CrearUsuarioPage from './features/users/pages/CrearUsuarioPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null); // { idUsuario, nombres, correo, rolNombre }

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = (usuario) => {
    setCurrentUser(usuario);
    setCurrentScreen('inventario');
  };

  const handleNavegar = (pantalla) => {
    if (pantalla === 'login') setCurrentUser(null);
    setCurrentScreen(pantalla);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'inventario':
        return <InventarioPage onNavegar={handleNavegar} currentUser={currentUser} />;
      case 'crear-producto':
        return <CrearProductoPage onNavegar={handleNavegar} />;
      case 'reports':
        return <ReportsScreen onNavigate={handleNavegar} currentUser={currentUser} />;
      case 'movimientos':
        return <MovimientosReportScreen onNavigate={handleNavegar} />;
      case 'movimiento':
        return <MovementScreen onNavigate={handleNavegar} currentUser={currentUser} />;
      case 'users':
        return <UsersPage onNavigate={handleNavegar} currentUser={currentUser} />;
      case 'crear-usuario':
        return <CrearUsuarioPage onNavigate={handleNavegar} currentUser={currentUser} />; 
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen h-screen font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-slate-800 text-white border border-slate-700',
          style: {
            background: '#1e293b',
            color: '#fff',
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderScreen()}
        </Motion.div>
      </AnimatePresence>
    </div>
  );
}