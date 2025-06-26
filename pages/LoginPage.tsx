
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '@/components/Auth'; // This now refers to the PinAuth logic
import { useAuthStore } from '@/store/authStore';
import { ROUTES, APP_NAME } from '@/constants';
import { Briefcase } from 'lucide-react'; // ShieldCheck might be more thematic for PIN

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 via-gray-800 to-black p-4">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-sm text-center">
        <div className="flex justify-center mb-6">
          <Briefcase className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{APP_NAME}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Acesso seguro ao sistema.</p>
        <Auth /> {/* This component is now the PIN Auth */}
      </div>
      <p className="mt-8 text-sm text-white/70">
        Problemas ao acessar? <a href="#" className="font-semibold hover:underline text-white/90">Contate o Suporte</a>
      </p>
    </div>
  );
};

export default LoginPage;