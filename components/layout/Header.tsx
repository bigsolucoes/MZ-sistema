
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuthStore } from '@/store/authStore';
import { Briefcase, Eye, EyeOff, Settings, LogOut, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { APP_NAME, ROUTES } from '@/constants';

const Header: React.FC = () => {
  const { isConfidentialMode, toggleConfidentialMode, user, logout, forceIdle, isAuthenticated } = useAuthStore(state => ({
    isConfidentialMode: state.isConfidentialMode,
    toggleConfidentialMode: state.toggleConfidentialMode,
    user: state.user,
    logout: state.logout,
    forceIdle: state.forceIdle,
    isAuthenticated: state.isAuthenticated,
  }));
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault(); // Prevent navigation if we are forcing idle
      forceIdle();
    } else {
      navigate(ROUTES.DASHBOARD); // Default Link behavior if not authenticated or not forcing idle
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
            onClick={handleLogoClick} 
            className="flex items-center space-x-2 cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(e as any);}}
            aria-label={`Ir para o Dashboard ou ativar tela de descanso`}
        >
          <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{APP_NAME}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleConfidentialMode}
            aria-label={isConfidentialMode ? "Desativar Modo Sigilo" : "Ativar Modo Sigilo"}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isConfidentialMode ? "eye-off" : "eye"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isConfidentialMode ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </Button>

          <Link to={ROUTES.SETTINGS}>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Configurações"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </Link>

          {user && (
            <div className="flex items-center space-x-2">
              {user.picture ? (
                 <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
              ) : (
                <UserCircle className="h-8 w-8 text-gray-400" />
              )}
               <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:inline">{user.name}</span>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;