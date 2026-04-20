import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoginPage from './features/auth/pages/LoginPage';
import InventarioPage from './features/products/pages/InventarioPage';
import CrearProductoPage from './features/products/pages/CrearProductoPage';
import ReportsScreen from './features/reports/pages/ReportsScreen';
import MovimientosReportScreen from './features/reports/pages/MovimientosReportScreen';

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
        return <ReportsScreen onNavigate={handleNavegar}  currentUser={currentUser} />;
      case 'movimientos':
        return <MovimientosReportScreen onNavigate={handleNavegar} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen h-screen font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}