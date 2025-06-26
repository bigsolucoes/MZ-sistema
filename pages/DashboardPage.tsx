
import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { AlertTriangle, CheckCircle, DollarSign, Users, CalendarClock, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  isCurrency?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, description, isCurrency = false }) => {
  const isConfidentialMode = useAuthStore((state) => state.isConfidentialMode);
  const displayValue = isCurrency && typeof value === 'number' ? formatCurrency(value, isConfidentialMode) : value;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
        <Icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{displayValue}</div>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  // Mock data for dashboard
  const summaryData = [
    { title: 'Prazos Vencendo Hoje', value: 3, icon: AlertTriangle, description: 'Requerem atenção imediata' },
    { title: 'Tarefas Concluídas (Semana)', value: 12, icon: CheckCircle, description: '+5% vs semana passada' },
    { title: 'Saldo Financeiro (Contas a Receber)', value: 25750.00, icon: DollarSign, isCurrency: true, description: 'Estimativa dos próximos 30 dias' },
    { title: 'Clientes Ativos', value: 42, icon: Users, description: 'Total de clientes com casos em andamento' },
    { title: 'Próximos Compromissos (Hoje)', value: 2, icon: CalendarClock, description: 'Verifique sua agenda' },
    { title: 'Casos em Andamento', value: 78, icon: Briefcase, description: 'Total de processos ativos' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Bem-vindo(a) de volta, {user?.name || 'Advogado(a)'}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400">Aqui está um resumo da sua atividade recente e informações importantes.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {summaryData.map((data, index) => (
          <SummaryCard key={index} {...data} />
        ))}
      </div>

      {/* Placeholder for future charts or more detailed sections */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Um log das últimas ações no sistema (placeholder).</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>- Novo prazo adicionado para o Caso XPTO-123.</li>
            <li>- Pagamento recebido do cliente Maria Silva.</li>
            <li>- Tarefa "Elaborar Petição Inicial" marcada como concluída.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
    