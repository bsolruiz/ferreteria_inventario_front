import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoginPage from './features/auth/pages/LoginPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginPage onLogin={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <div className="text-white p-8">Dashboard próximamente...</div>;
      default:
        return <LoginPage onLogin={() => setCurrentScreen('dashboard')} />;
    }
  };

  return (
    // ← Agrega h-screen aquí
    <div className="min-h-screen h-screen font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"  // ← h-full para ocupar todo el padre
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}