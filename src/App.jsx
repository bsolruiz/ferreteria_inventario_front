import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoginPage from './features/auth/pages/LoginPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null); // { idUsuario, nombres, correo, rolNombre }

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = (usuario) => {
    setCurrentUser(usuario);
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <div className="text-white p-8">
            <p>Dashboard próximamente...</p>
            <p className="text-slate-400 mt-2 text-sm">
              Sesión: <strong>{currentUser?.nombres}</strong> — Rol: <strong>{currentUser?.rolNombre}</strong>
            </p>
          </div>
        );
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