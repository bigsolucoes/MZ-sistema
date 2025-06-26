import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import type { Task, TaskStatus } from '@/types';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/Button';


interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskArchive?: (taskId: string) => void;
}

const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({ id, title, tasks, onTaskClick, onTaskDelete, onTaskArchive }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const columnBaseStyle = "p-3 rounded-lg shadow min-h-[300px] flex flex-col";
  const columnThemeStyle = `
    bg-gray-100 dark:bg-gray-700/60 
    html.inverted & { 
      background-color: hsl(var(--card) / 0.5); 
      border: 1px solid hsl(var(--border) / 0.7);
    }
  `;
  const columnDropIndicator = isOver ? 'ring-2 ring-blue-500 dark:ring-amber-500 html.inverted:ring-yellow-400' : '';


  return (
    <div
      ref={setNodeRef}
      className={`${columnBaseStyle} ${columnThemeStyle} ${columnDropIndicator}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 html.inverted:text-[hsl(var(--foreground))]">{title} ({tasks.length})</h3>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => console.log(`Add task to ${title}`)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white html.inverted:text-[hsl(var(--muted-foreground))] html.inverted:hover:text-[hsl(var(--foreground))]"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>
      
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 overflow-y-auto flex-grow p-1 -m-1"> {/* Added small padding for scrollbar space */}
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                onClick={() => onTaskClick(task)}
                onDelete={onTaskDelete ? () => onTaskDelete(task.id) : undefined}
                onArchive={onTaskArchive ? () => onTaskArchive(task.id) : undefined}
              />
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 html.inverted:text-[hsl(var(--muted-foreground))] py-4">
              Nenhuma tarefa aqui.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanColumn = React.memo(KanbanColumnComponent);
export default KanbanColumn;