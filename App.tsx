

import React, { useEffect, useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google'; // Removed
import { useAuthStore } from '@/store/authStore';
import useIdleTimer from '@/hooks/useIdleTimer';
import ProtectedRoutes from '@/components/ProtectedRoutes';
import IdleScreen from '@/components/IdleScreen';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AgendaPage from '@/pages/AgendaPage';
import TasksPage from '@/pages/TasksPage';
import ContractsPage from '@/pages/ContractsPage';
import ClientFinancePage from '@/pages/ClientFinancePage';
import DebtorRepassesPage from '@/pages/DebtorRepassesPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ROUTES, IDLE_TIMEOUT_DURATION } from '@/constants'; // GOOGLE_CLIENT_ID removed
import { Toaster } from '@/components/ui/Toaster'; 

// Define BriefcaseIcon outside the App component
interface BriefcaseIconProps {
    className?: string;
}
const BriefcaseIcon: React.FC<BriefcaseIconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5h-9Z" />
    </svg>
);

const App: React.FC = () => {
  const { isAuthenticated, isAppForcedIdle, resetForceIdle } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isAppForcedIdle: state.isAppForcedIdle,
    resetForceIdle: state.resetForceIdle,
  }));
  const [showInitialSpinner, setShowInitialSpinner] = useState(true); // Changed from Idle to Spinner
  const [isTimerIdle, setIsTimerIdle] = useState(false);


  useEffect(() => {
    const applyCurrentTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      document.documentElement.classList.remove('dark', 'inverted'); 

      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.className = 'bg-gray-900 text-gray-100'; 
      } else if (savedTheme === 'inverted') {
        document.documentElement.classList.add('inverted');
        document.body.className = 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]'; 
      } else { 
        document.body.className = 'bg-gray-50 text-gray-900'; 
        if (!savedTheme || (savedTheme !== 'light' && savedTheme !== 'dark' && savedTheme !== 'inverted')) {
          localStorage.setItem('theme', 'light');
        }
      }
    };
    applyCurrentTheme();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialSpinner(false);
    }, 1000); // Show spinner/logo briefly for 1 second
    return () => clearTimeout(timer);
  }, []);

  const handleTimerIdle = useCallback(() => {
    if (isAuthenticated) { 
      setIsTimerIdle(true);
    }
  }, [isAuthenticated]); // Added isAuthenticated to dependency array

  useIdleTimer(IDLE_TIMEOUT_DURATION, handleTimerIdle);

  useEffect(() => {
    const resetAllIdleStates = () => {
      setIsTimerIdle(false);
      if (isAppForcedIdle) {
        resetForceIdle(); 
      }
    };
    
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach(event => window.addEventListener(event, resetAllIdleStates));
    
    resetAllIdleStates(); // Initial check

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, resetAllIdleStates));
    };
  }, [isAppForcedIdle, resetForceIdle]);

  if (showInitialSpinner && !isAuthenticated) { 
    // Show a simple loading or splash screen, not the full IdleScreen if not authenticated
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            {/* You can put a spinner or your app logo here */}
            <BriefcaseIcon className="w-24 h-24 text-blue-500 animate-pulse" /> 
        </div>
    );
  }
  
  if ((isTimerIdle || isAppForcedIdle) && isAuthenticated) {
     return <IdleScreen isVisible={true} />;
  }


  return (
    // <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> // Removed
    <>
      <HashRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />} />
          
          <Route element={<ProtectedRoutes />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.AGENDA} element={<AgendaPage />} />
            <Route path={ROUTES.TAREFAS} element={<TasksPage />} />
            <Route path={ROUTES.CONTRATOS} element={<ContractsPage />} />
            <Route path={ROUTES.FINANCEIRO_CLIENTES} element={<ClientFinancePage />} />
            <Route path={ROUTES.FINANCEIRO_REPASSES} element={<DebtorRepassesPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
      <Toaster />
    </>
    // </GoogleOAuthProvider> // Removed
  );
};


export default App;