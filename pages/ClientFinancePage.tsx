
import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { ClientFinancialRecord } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlusCircle, Download, Send, Filter, Users } from 'lucide-react';

const mockClientRecords: { [clientId: string]: ClientFinancialRecord[] } = {
  'client1': [
    { id: 'cf001', date: '2023-07-01', description: 'Honorários Iniciais - Caso Divórcio', debit: 0, credit: 2500, balance: 2500 },
    { id: 'cf002', date: '2023-07-15', description: 'Custas Processuais', debit: 150, credit: 0, balance: 2350 },
    { id: 'cf003', date: '2023-08-01', description: 'Pagamento Parcial Honorários', debit: 0, credit: 1000, balance: 3350 },
  ],
  'client2': [
    { id: 'cf004', date: '2023-06-10', description: 'Consulta Inicial', debit: 0, credit: 500, balance: 500 },
    { id: 'cf005', date: '2023-06-20', description: 'Elaboração de Contrato Social', debit: 0, credit: 1800, balance: 2300 },
    { id: 'cf006', date: '2023-07-05', description: 'Taxas Cartorárias', debit: 250, credit: 0, balance: 2050 },
  ],
};

const mockClients = [
    { id: 'client1', name: 'Ana Beatriz Costa' },
    { id: 'client2', name: 'Carlos Eduardo Lima' },
    { id: 'client3', name: 'Daniela Ferreira Alves' },
];

const ClientFinancePage: React.FC = () => {
  const { isConfidentialMode } = useAuthStore();
  const [selectedClientId, setSelectedClientId] = useState<string>(mockClients[0].id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterDateRange, setFilterDateRange] = useState<{ start?: string, end?: string }>({});

  const clientRecords = useMemo(() => {
    // Add date filtering logic here if filterDateRange is used
    return mockClientRecords[selectedClientId] || [];
  }, [selectedClientId/*, filterDateRange*/]);

  const currentBalance = useMemo(() => {
    return clientRecords.reduce((acc, record) => acc + record.credit - record.debit, 0);
  }, [clientRecords]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Financeiro do Cliente</h1>
        <div className="flex space-x-2">
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtrar Data</Button>
            <Button><PlusCircle className="mr-2 h-5 w-5" /> Novo Lançamento</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Extrato de Conta Corrente</CardTitle>
              <CardDescription>Visualize os débitos e créditos do cliente selecionado.</CardDescription>
            </div>
            <div className="w-1/3">
              <label htmlFor="clientSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecionar Cliente</label>
              <select
                id="clientSelect"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              >
                {mockClients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clientRecords.length === 0 ? (
             <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum registro financeiro</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Não há lançamentos para este cliente ou período.</p>
             </div>
          ) : (
            <>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Débito</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crédito</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Saldo</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {clientRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(record.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.description}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${record.debit > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-300'}`}>
                        {formatCurrency(record.debit, isConfidentialMode)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${record.credit > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-300'}`}>
                        {formatCurrency(record.credit, isConfidentialMode)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right font-medium">{formatCurrency(record.balance, isConfidentialMode)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                <div>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Baixar PDF</Button>
                    <Button variant="outline" className="ml-2"><Send className="mr-2 h-4 w-4" /> Enviar por E-mail</Button>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Saldo Atual:</p>
                    <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(currentBalance, isConfidentialMode)}
                    </p>
                </div>
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientFinancePage;
    