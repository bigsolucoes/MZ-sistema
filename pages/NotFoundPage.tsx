
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { ROUTES } from '@/constants';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
      <AlertTriangle className="w-24 h-24 text-yellow-500 mb-6" />
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Página Não Encontrada</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Button asChild variant="default">
        <Link to={ROUTES.DASHBOARD}>Voltar para o Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
    