
import React, { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import type { Task, KanbanColumn, UserProfile, TaskUpdate } from '@/types'; // UserProfile is a type
import { TaskStatus, TaskType } from '@/types'; // These are enums used as values
import { MOCK_USER_PROFILE, KANBAN_COLUMNS_PRAZOS, KANBAN_COLUMNS_TAREFAS } from '@/constants'; // For assignee example
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { formatDate, getYYYYMMDDString } from '@/utils/formatters';
import { useAuthStore } from '@/store/authStore';

// Mock initial data
const initialProcessualTasks: Task[] = [
  { id: 'p1', title: 'Elaborar Petição Inicial - Caso Silva', description: 'Urgente, cliente aguardando.', status: TaskStatus.TODO, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), assignee: MOCK_USER_PROFILE as UserProfile, updates: [] },
  { id: 'p2', title: 'Agendar Audiência - Caso Souza', status: TaskStatus.IN_PROGRESS, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), updates: [{id: 'upd-p2-1', content: 'Cliente solicitou urgência.', createdAt: new Date(Date.now() - 1* 24*60*60*1000), updatedAt: new Date(Date.now() - 1* 24*60*60*1000), author: MOCK_USER_PROFILE}] },
  { id: 'p3', title: 'Analisar Documentos Recebidos - Caso Ferreira', status: TaskStatus.ON_HOLD, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), updates: [] }, // Example for ON_HOLD
  { id: 'p4', title: 'Recurso Apelação - Caso Almeida', status: TaskStatus.DONE, type: TaskType.PROCESSUAL_DEADLINE, dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), updates: [] },
];

const initialInternalTasks: Task[] = [
  { id: 'i1', title: 'Revisar Minuta de Contrato Cliente X', description: 'Verificar cláusulas de confidencialidade.', status: TaskStatus.IN_PROGRESS, type: TaskType.INTERNAL_TASK, updates: [] },
  { id: 'i2', title: 'Organizar Arquivos Digitais 2023', status: TaskStatus.TODO, type: TaskType.INTERNAL_TASK, updates: [] },
  { id: 'i3', title: 'Pesquisar Jurisprudência Recente sobre IA', status: TaskStatus.DONE, type: TaskType.INTERNAL_TASK, dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), updates: [] },
];

const groupTasksByStatus = (tasks: Task[]): Record<TaskStatus, Task[]> => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);
};


const TasksPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // For editing task details

  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [currentNoteContent, setCurrentNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);


  // These would typically come from a store or API
  const [processualTasks, setProcessualTasks] = useState<Task[]>(initialProcessualTasks);
  const [internalTasks, setInternalTasks] = useState<Task[]>(initialInternalTasks);

  const createColumns = (tasks: Task[], type: TaskType): KanbanColumn[] => {
    const grouped = groupTasksByStatus(tasks.filter(t => t.type === type));
    const titles = type === TaskType.PROCESSUAL_DEADLINE ? KANBAN_COLUMNS_PRAZOS : KANBAN_COLUMNS_TAREFAS;

    return [
      { id: TaskStatus.TODO, title: titles[TaskStatus.TODO], tasks: grouped[TaskStatus.TODO] || [] },
      { id: TaskStatus.ON_HOLD, title: titles[TaskStatus.ON_HOLD], tasks: grouped[TaskStatus.ON_HOLD] || [] },
      { id: TaskStatus.IN_PROGRESS, title: titles[TaskStatus.IN_PROGRESS], tasks: grouped[TaskStatus.IN_PROGRESS] || [] },
      { id: TaskStatus.DONE, title: titles[TaskStatus.DONE], tasks: grouped[TaskStatus.DONE] || [] },
    ];
  };
  
  const [processualColumns, setProcessualColumns] = useState<KanbanColumn[]>(createColumns(processualTasks, TaskType.PROCESSUAL_DEADLINE));
  const [internalColumns, setInternalColumns] = useState<KanbanColumn[]>(createColumns(internalTasks, TaskType.INTERNAL_TASK));

  useEffect(() => {
    setProcessualColumns(createColumns(processualTasks, TaskType.PROCESSUAL_DEADLINE));
  }, [processualTasks]);

  useEffect(() => {
    setInternalColumns(createColumns(internalTasks, TaskType.INTERNAL_TASK));
  }, [internalTasks]);


  const handleTaskClick = (task: Task) => {
    setSelectedTask({...task, updates: task.updates || []}); // Ensure updates is an array
    setIsEditMode(false); // View mode by default
    setShowNoteEditor(false); // Close note editor
    setCurrentNoteContent('');
    setEditingNoteId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setIsEditMode(false);
    setShowNoteEditor(false);
    setCurrentNoteContent('');
    setEditingNoteId(null);
  };

  const handleSaveTaskDetails = () => { // Renamed from handleTaskUpdate for clarity
    if (!selectedTask) return;
    
    // Logic for saving notes is now separate (handleSaveNote)
    // This function now only saves the main task details
    console.log("Updating task details:", selectedTask);

    if(selectedTask.type === TaskType.PROCESSUAL_DEADLINE) {
        setProcessualTasks(prev => prev.map(t => t.id === selectedTask.id ? selectedTask : t));
    } else {
        setInternalTasks(prev => prev.map(t => t.id === selectedTask.id ? selectedTask : t));
    }
    // If not adding a new task, potentially close modal or switch back to view mode.
    // If it was a new task, this is handled by handleAddNewTask.
    if (!selectedTask.id.startsWith('new-')) {
        setIsEditMode(false); // Go back to view mode after saving details
    }
  };
  
  const handleTaskDelete = (taskId: string, columnId: TaskStatus, taskType: TaskType) => {
    console.log(`Simulated delete for task ${taskId} from column ${columnId} of type ${taskType}`);
    if (taskType === TaskType.PROCESSUAL_DEADLINE) {
      setProcessualTasks(prev => prev.filter(t => t.id !== taskId));
    } else {
      setInternalTasks(prev => prev.filter(t => t.id !== taskId));
    }
     if (selectedTask && selectedTask.id === taskId) {
        handleModalClose(); // Close modal if the deleted task was open
    }
  };

  const handleTaskArchive = (taskId: string, columnId: TaskStatus, taskType: TaskType) => {
     console.log(`Simulated archive for task ${taskId} from column ${columnId} of type ${taskType}`);
     handleTaskDelete(taskId, columnId, taskType); // For now, archive does the same as delete
  };

  const handleOpenAddTaskModal = (type: TaskType) => {
    setSelectedTask({ 
      id: `new-${Date.now()}`, 
      title: '',
      description: '',
      status: TaskStatus.TODO,
      type: type,
      dueDate: new Date(),
      updates: [] 
    });
    setIsEditMode(true); 
    setShowNoteEditor(false);
    setIsModalOpen(true);
  };

  const handleAddNewTask = () => {
    if (!selectedTask || !selectedTask.title) {
        alert("O título da tarefa é obrigatório.");
        return;
    }
    const newTask: Task = { ...selectedTask, id: `task-${Date.now()}` }; 
    console.log("Adding new task:", newTask);

    if (newTask.type === TaskType.PROCESSUAL_DEADLINE) {
        setProcessualTasks(prev => [...prev, newTask]);
    } else {
        setInternalTasks(prev => [...prev, newTask]);
    }
    handleModalClose();
  };

  // --- Note Management Functions ---
  const handleOpenNoteEditorForAdd = () => {
    setEditingNoteId(null);
    setCurrentNoteContent('');
    setShowNoteEditor(true);
  };

  const handleOpenNoteEditorForEdit = (note: TaskUpdate) => {
    setEditingNoteId(note.id);
    setCurrentNoteContent(note.content);
    setShowNoteEditor(true);
  };

  const handleCloseNoteEditor = () => {
    setShowNoteEditor(false);
    setEditingNoteId(null);
    setCurrentNoteContent('');
  };

  const handleSaveNote = () => {
    if (!selectedTask || !currentNoteContent.trim()) {
      alert("O conteúdo da anotação não pode estar vazio.");
      return;
    }

    let updatedNotes: TaskUpdate[];
    const now = new Date();

    if (editingNoteId) { // Editing existing note
      updatedNotes = (selectedTask.updates || []).map(note =>
        note.id === editingNoteId
          ? { ...note, content: currentNoteContent.trim(), updatedAt: now }
          : note
      );
    } else { // Adding new note
      const newNote: TaskUpdate = {
        id: `note-${Date.now()}`,
        content: currentNoteContent.trim(),
        createdAt: now,
        updatedAt: now,
        author: currentUser || MOCK_USER_PROFILE, // Prefer current logged in user
      };
      updatedNotes = [...(selectedTask.updates || []), newNote];
    }

    const updatedTask = { ...selectedTask, updates: updatedNotes };
    setSelectedTask(updatedTask); // Update the state of the selected task in the modal

    // Persist this change to the main task list
    if(updatedTask.type === TaskType.PROCESSUAL_DEADLINE) {
        setProcessualTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    } else {
        setInternalTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
    
    handleCloseNoteEditor();
  };
  // --- End Note Management Functions ---

  const renderModalFooter = () => {
    if (!selectedTask) return null;

    const isNewTask = selectedTask.id.startsWith('new-');

    return (
        <div className="flex justify-between items-center">
            <div>
              {!isNewTask && (
                  <Button 
                      variant="destructive" 
                      onClick={() => handleTaskDelete(selectedTask.id, selectedTask.status, selectedTask.type)}
                  >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir Tarefa
                  </Button>
              )}
            </div>
            <div className="flex space-x-2">
              {(!isEditMode && !isNewTask) && (
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                      <Edit3 className="mr-2 h-4 w-4" /> Editar Detalhes
                  </Button>
              )}
              {(isEditMode || isNewTask) && (
                  <>
                      <Button variant="outline" onClick={handleModalClose}>Cancelar</Button>
                      <Button onClick={isNewTask ? handleAddNewTask : handleSaveTaskDetails}>
                          {isNewTask ? 'Adicionar Tarefa' : 'Salvar Detalhes'}
                      </Button>
                  </>
              )}
            </div>
          </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Prazos e Tarefas</h1>
        <div className="space-x-2">
            <Button onClick={() => handleOpenAddTaskModal(TaskType.PROCESSUAL_DEADLINE)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Prazo Processual
            </Button>
            <Button onClick={() => handleOpenAddTaskModal(TaskType.INTERNAL_TASK)} variant="secondary">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Tarefa Interna
            </Button>
        </div>
      </div>

      <KanbanBoard 
        title="Prazos Processuais" 
        initialColumns={processualColumns} 
        onTaskClick={handleTaskClick}
        onTaskDelete={(taskId, columnId) => handleTaskDelete(taskId, columnId, TaskType.PROCESSUAL_DEADLINE)}
        onTaskArchive={(taskId, columnId) => handleTaskArchive(taskId, columnId, TaskType.PROCESSUAL_DEADLINE)}
      />
      <KanbanBoard 
        title="Tarefas Internas" 
        initialColumns={internalColumns} 
        onTaskClick={handleTaskClick} 
        onTaskDelete={(taskId, columnId) => handleTaskDelete(taskId, columnId, TaskType.INTERNAL_TASK)}
        onTaskArchive={(taskId, columnId) => handleTaskArchive(taskId, columnId, TaskType.INTERNAL_TASK)}
      />

      {selectedTask && (
        <Dialog 
            isOpen={isModalOpen} 
            onClose={handleModalClose} 
            title={selectedTask.id.startsWith('new-') ? "Adicionar Tarefa" : (isEditMode ? "Editar Tarefa" : "Detalhes da Tarefa")} 
            size="3xl" // Using a wider dialog
            footerContent={renderModalFooter()}
        >
          <div className="flex flex-row space-x-4 max-h-[calc(80vh-150px)]"> {/* Adjusted max height for content */}
            {/* Left Panel: Task Details */}
            <div className="w-3/5 flex-shrink-0 border-r dark:border-gray-600 pr-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="taskTitle">Título</Label>
                  <Input
                    id="taskTitle"
                    value={selectedTask.title}
                    onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                    readOnly={!isEditMode && !selectedTask.id.startsWith('new-')}
                    className={(!isEditMode && !selectedTask.id.startsWith('new-')) ? "bg-gray-100 dark:bg-gray-700 cursor-default" : "dark:bg-gray-700"}
                  />
                </div>
                <div>
                  <Label htmlFor="taskDescription">Descrição</Label>
                  <Textarea
                    id="taskDescription"
                    value={selectedTask.description || ''}
                    onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                    readOnly={!isEditMode && !selectedTask.id.startsWith('new-')}
                    className={(!isEditMode && !selectedTask.id.startsWith('new-')) ? "bg-gray-100 dark:bg-gray-700 cursor-default" : "dark:bg-gray-700"}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="taskStatus">Status</Label>
                        <select
                            id="taskStatus"
                            value={selectedTask.status}
                            onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value as TaskStatus })}
                            disabled={!isEditMode && !selectedTask.id.startsWith('new-')}
                            className={`w-full p-2 border rounded-md dark:border-gray-600 ${(!isEditMode && !selectedTask.id.startsWith('new-')) ? "bg-gray-100 dark:bg-gray-700 appearance-none cursor-default" : "dark:bg-gray-700"}`}
                        >
                            {Object.values(TaskStatus).map(status => ( // Iterates over enum values
                              <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="taskDueDate">Data de Vencimento</Label>
                        <Input
                            id="taskDueDate"
                            type="date"
                            value={getYYYYMMDDString(selectedTask.dueDate)}
                            onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined })}
                            readOnly={!isEditMode && !selectedTask.id.startsWith('new-')}
                            className={(!isEditMode && !selectedTask.id.startsWith('new-')) ? "bg-gray-100 dark:bg-gray-700 cursor-default" : "dark:bg-gray-700"}
                        />
                    </div>
                </div>
                {selectedTask.assignee && (
                    <div>
                        <Label>Responsável</Label>
                        <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <img src={selectedTask.assignee.picture || `https://picsum.photos/seed/${selectedTask.assignee.id}/32/32`} alt={selectedTask.assignee.name} className="h-8 w-8 rounded-full" />
                            <span>{selectedTask.assignee.name}</span>
                        </div>
                    </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Tipo: {selectedTask.type}
                </div>
              </div>
            </div>

            {/* Right Panel: Updates History */}
            <div className="w-2/5 flex-shrink-0 flex flex-col pl-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Histórico de Atualizações</h3>
              {!selectedTask.id.startsWith('new-') && (
                <Button onClick={handleOpenNoteEditorForAdd} size="sm" className="mb-3 self-start" variant="secondary">
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Anotação
                </Button>
              )}

              {showNoteEditor && !selectedTask.id.startsWith('new-') && (
                <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                  <Label htmlFor="noteContent" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {editingNoteId ? 'Editar Anotação' : 'Nova Anotação'}
                  </Label>
                  <Textarea id="noteContent" value={currentNoteContent} onChange={(e) => setCurrentNoteContent(e.target.value)} rows={3} className="mt-1 dark:bg-gray-700" />
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleCloseNoteEditor}>Cancelar</Button>
                    <Button size="sm" onClick={handleSaveNote}>Salvar Anotação</Button>
                  </div>
                </div>
              )}

              <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {(selectedTask.updates && selectedTask.updates.length > 0) ? (
                  selectedTask.updates.slice().reverse().map(note => ( // Newest first
                    <div key={note.id} className="p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm border dark:border-gray-600">
                      <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{note.content}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex justify-between items-center">
                        <div>
                          <p>Criado: {formatDate(note.createdAt, { dateStyle: 'short', timeStyle: 'short' })}</p>
                          <p>Editado: {formatDate(note.updatedAt, { dateStyle: 'short', timeStyle: 'short' })}</p>
                          {note.author && <p>Por: {note.author.name}</p>}
                        </div>
                        {!selectedTask.id.startsWith('new-') && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenNoteEditorForEdit(note)} title="Editar Anotação">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                    {selectedTask.id.startsWith('new-') ? 'Anotações disponíveis após criar a tarefa.' : 'Nenhuma anotação ainda.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default TasksPage;