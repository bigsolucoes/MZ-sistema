import React, { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate, getYYYYMMDDString } from '@/utils/formatters';
import type { Contract, Task } from '@/types'; // Added Task type
// Enums needed for mock tasks and other parts of the component
import { TaskStatus, TaskType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label'; // Added Label
import { FileText, PlusCircle, Search, Edit2, Trash2, Link2, ListChecks } from 'lucide-react'; // Added Link2, ListChecks

// Temporary import of mock tasks for linking feature
// In a real app, this data would come from a service or global store
const mockProcessualTasks: Task[] = [
  { id: 'p1', title: 'Elaborar Petição Inicial - Caso Silva', description: 'Urgente, cliente aguardando.', status: TaskStatus.TODO, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), updates: [] },
  { id: 'p2', title: 'Agendar Audiência - Caso Souza', status: TaskStatus.IN_PROGRESS, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), updates: [] },
  { id: 'p3', title: 'Analisar Documentos Recebidos - Caso Ferreira', status: TaskStatus.ON_HOLD, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), updates: [] },
  { id: 'p4', title: 'Recurso Apelação - Caso Almeida', status: TaskStatus.DONE, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), updates: [] },
];
const mockInternalTasks: Task[] = [
  { id: 'i1', title: 'Revisar Minuta de Contrato Cliente X', description: 'Verificar cláusulas de confidencialidade.', status: TaskStatus.IN_PROGRESS, type: TaskType.INTERNAL_TASK, updates: [] },
  { id: 'i2', title: 'Organizar Arquivos Digitais 2023', status: TaskStatus.TODO, type: TaskType.INTERNAL_TASK, updates: [] },
  { id: 'i3', title: 'Pesquisar Jurisprudência Recente sobre IA', status: TaskStatus.DONE, type: TaskType.INTERNAL_TASK, dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), updates: [] },
];


const allAvailableTasks: Task[] = [...mockProcessualTasks, ...mockInternalTasks];

const mockContracts: Contract[] = [
  { id: 'c001', clientName: 'Empresa Alpha Ltda.', title: 'Prestação de Serviços Jurídicos Contínuos', startDate: '2023-01-15', value: 5000, status: 'Ativo', linkedTaskIds: ['p1', 'i1'] },
  { id: 'c002', clientName: 'João Silva', title: 'Ação de Indenização', startDate: '2023-05-20', value: 1200, status: 'Ativo', linkedTaskIds: ['p2'] },
  { id: 'c003', clientName: 'Consultoria Beta S.A.', title: 'Consultoria Tributária Especializada', startDate: '2022-11-01', value: 8500, status: 'Encerrado' },
  { id: 'c004', clientName: 'Maria Oliveira', title: 'Defesa em Processo Trabalhista', startDate: '2023-08-10', value: 3000, status: 'Pendente', linkedTaskIds: [] },
];

const ContractsPage: React.FC = () => {
  const { isConfidentialMode } = useAuthStore();
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | Partial<Contract> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // To distinguish view/edit in modal

  const filteredContracts = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) return contracts;

    return contracts.filter(contract => {
      const titleMatch = contract.title.toLowerCase().includes(lowerSearchTerm);
      const clientNameMatch = contract.clientName.toLowerCase().includes(lowerSearchTerm);
      
      let taskMatch = false;
      if (contract.linkedTaskIds && contract.linkedTaskIds.length > 0) {
        taskMatch = contract.linkedTaskIds.some(taskId => {
          const task = allAvailableTasks.find(t => t.id === taskId);
          return task && task.title.toLowerCase().includes(lowerSearchTerm);
        });
      }
      
      return titleMatch || clientNameMatch || taskMatch;
    });
  }, [contracts, searchTerm]);

  const handleOpenModal = (contract?: Contract) => {
    if (contract) {
      setEditingContract({ ...contract, linkedTaskIds: contract.linkedTaskIds || [] });
      setIsEditMode(false); // Start in view mode for existing contracts
    } else {
      setEditingContract({ title: '', clientName: '', startDate: '', value: 0, status: 'Pendente', linkedTaskIds: [] });
      setIsEditMode(true); // Start in edit mode for new contracts
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
    setIsEditMode(false);
  };

  const handleSaveContract = () => {
    if (!editingContract) return;

    if ('id' in editingContract && editingContract.id) { // Editing existing
      setContracts(contracts.map(c => c.id === editingContract.id ? editingContract as Contract : c));
    } else { // Adding new
      const newContract = { ...editingContract, id: `c${Date.now()}` } as Contract;
      setContracts([...contracts, newContract]);
    }
    handleCloseModal();
  };
  
  const handleDeleteContract = (contractId: string) => {
    // Add confirmation dialog in real app
    setContracts(contracts.filter(c => c.id !== contractId));
     if (editingContract && 'id' in editingContract && editingContract.id === contractId) {
      handleCloseModal(); // Close modal if the deleted contract was open
    }
  };

  const handleToggleTaskLink = (taskId: string) => {
    if (!editingContract) return;
    const currentLinkedIds = editingContract.linkedTaskIds || [];
    const newLinkedIds = currentLinkedIds.includes(taskId)
      ? currentLinkedIds.filter(id => id !== taskId)
      : [...currentLinkedIds, taskId];
    setEditingContract({ ...editingContract, linkedTaskIds: newLinkedIds });
  };

  const getStatusClass = (status: 'Ativo' | 'Encerrado' | 'Pendente') => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
      case 'Encerrado': return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100';
      default: return '';
    }
  };
  
  const renderModalFooter = () => {
    if (!editingContract) return null;
    const isNewContract = !('id' in editingContract && editingContract.id);

    return (
        <div className="flex justify-between items-center w-full">
             <div>
                {!isNewContract && (
                    <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteContract((editingContract as Contract).id)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir Contrato
                    </Button>
                )}
            </div>
            <div className="flex space-x-2">
                {!isEditMode && !isNewContract && (
                    <Button variant="outline" onClick={() => setIsEditMode(true)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Editar Detalhes
                    </Button>
                )}
                 {(isEditMode || isNewContract) && (
                    <>
                        <Button variant="outline" onClick={isNewContract ? handleCloseModal : () => setIsEditMode(false)}>
                            {isNewContract ? 'Cancelar' : 'Cancelar Edição'}
                        </Button>
                        <Button onClick={handleSaveContract}>
                            {isNewContract ? 'Adicionar Contrato' : 'Salvar Alterações'}
                        </Button>
                    </>
                )}
                 {!isEditMode && !isNewContract && (
                     <Button onClick={handleCloseModal}>Fechar</Button>
                 )}
            </div>
        </div>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Contratos</h1>
        <Button onClick={() => handleOpenModal()} >
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Contrato
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Contratos</CardTitle>
          <CardDescription>Visualize, adicione ou edite contratos de honorários e vincule tarefas.</CardDescription>
          <div className="mt-4 relative">
            <Input 
              placeholder="Buscar por título, cliente ou tarefa vinculada..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum contrato encontrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data Início</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tarefas Vinculadas</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{contract.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{contract.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(contract.startDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(contract.value, isConfidentialMode)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {contract.linkedTaskIds && contract.linkedTaskIds.length > 0 
                          ? `${contract.linkedTaskIds.length} tarefa(s)` 
                          : 'Nenhuma'}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" onClick={() => handleOpenModal(contract)} title="Ver Detalhes/Editar">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {/* Removed individual delete from table row to simplify, delete is in modal */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {editingContract && (
        <Dialog 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            title={!('id' in editingContract && editingContract.id) ? "Novo Contrato" : (isEditMode ? "Editar Contrato" : "Detalhes do Contrato")}
            size="3xl"
            footerContent={renderModalFooter()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(80vh-150px)] overflow-y-auto pr-2">
            {/* Left Panel: Contract Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="contractTitle">Título do Contrato</Label>
                <Input id="contractTitle" value={editingContract.title || ''} onChange={(e) => setEditingContract({...editingContract, title: e.target.value})} readOnly={!isEditMode} className={!isEditMode ? "bg-gray-100 dark:bg-gray-700 cursor-default" : "dark:bg-gray-700"}/>
              </div>
              <div>
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input id="clientName" value={editingContract.clientName || ''} onChange={(e) => setEditingContract({...editingContract, clientName: e.target.value})} readOnly={!isEditMode} className={!isEditMode ? "bg-gray-100 dark:bg-gray-700 cursor-default" : "dark:bg-gray-700"}/>
              </div>
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input id="startDate" type="date" value={getYYYYMMDDString(editingContract.startDate)} onChange={(e) => setEditingContract({...editingContract, startDate: e.target.value})} readOnly={!isEditMode} className={!isEditMode ? "bg-gray-100 dark:bg-gray-700 cursor-default" : "dark:bg-gray-700"}/>
              </div>
              <div>
                <Label htmlFor="contractValue">Valor (R$)</Label>
                <Input id="contractValue" type="number" value={editingContract.value || 0} onChange={(e) => setEditingContract({...editingContract, value: parseFloat(e.target.value)})} readOnly={!isEditMode} className={!isEditMode ? "bg-gray-100 dark:bg-gray-700 cursor-default" : "dark:bg-gray-700"}/>
              </div>
              <div>
                <Label htmlFor="contractStatus">Status</Label>
                <select 
                  id="contractStatus" 
                  value={editingContract.status || 'Pendente'} 
                  onChange={(e) => setEditingContract({...editingContract, status: e.target.value as Contract['status']})}
                  disabled={!isEditMode}
                  className={`w-full p-2 border rounded-md dark:border-gray-600 ${!isEditMode ? "bg-gray-100 dark:bg-gray-700 appearance-none cursor-default" : "dark:bg-gray-700"}`}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Encerrado">Encerrado</option>
                </select>
              </div>
            </div>

            {/* Right Panel: Linked Tasks */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white">
                <ListChecks className="mr-2 h-5 w-5" />
                Tarefas Vinculadas
              </h3>
              {isEditMode ? (
                <div className="space-y-2 max-h-60 overflow-y-auto border dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700/30">
                  {allAvailableTasks.length > 0 ? allAvailableTasks.map(task => (
                    <div key={task.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`task-${task.id}`}
                        checked={editingContract.linkedTaskIds?.includes(task.id) || false}
                        onChange={() => handleToggleTaskLink(task.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                      />
                      <Label htmlFor={`task-${task.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {task.title} <span className="text-xs text-gray-500 dark:text-gray-400">({task.type === TaskType.PROCESSUAL_DEADLINE ? "Prazo" : "Interna"})</span>
                      </Label>
                    </div>
                  )) : <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma tarefa disponível para vincular.</p>}
                </div>
              ) : (
                <div className="space-y-1">
                  {(editingContract.linkedTaskIds && editingContract.linkedTaskIds.length > 0) ? (
                    editingContract.linkedTaskIds.map(taskId => {
                      const task = allAvailableTasks.find(t => t.id === taskId);
                      return task ? (
                        <div key={taskId} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200 flex items-center">
                           <Link2 className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                           {task.title}
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma tarefa vinculada.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ContractsPage;