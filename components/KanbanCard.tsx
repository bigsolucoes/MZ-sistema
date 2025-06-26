import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types';
import { GripVertical, Archive, Trash2 } from 'lucide-react'; // Edit2 was removed as it's not used here
import { formatDate } from '@/utils/formatters';
import { Button } from './ui/Button';

interface KanbanCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDelete?: () => void;
  onArchive?: () => void;
  isOverlay?: boolean; // For DragOverlay styling
}

const KanbanCardComponent: React.FC<KanbanCardProps> = ({ task, onClick, onDelete, onArchive, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'TASK', task },
    resizeObserverConfig: {}, 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging || isOverlay ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : undefined,
    cursor: isOverlay ? 'grabbing' : 'grab',
    zIndex: isDragging || isOverlay ? 100 : undefined, 
  };
  
  const cardClasses = `
    p-3 rounded-md shadow-sm border 
    bg-yellow-100 border-yellow-300 text-neutral-800
    dark:bg-yellow-900/70 dark:border-yellow-700/50 dark:text-yellow-50
    html.inverted:bg-yellow-100 html.inverted:border-yellow-300 html.inverted:text-neutral-800
    transform rotate-[-1deg] hover:rotate-0 transition-transform
    ${isOverlay ? "ring-2 ring-blue-500 dark:ring-amber-500 html.inverted:ring-yellow-400" : ""}
    group relative
  `;
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cardClasses}
    >
      <div className="flex items-start justify-between">
        <div onClick={() => onClick(task)} className="flex-grow cursor-pointer pr-8">
          <h4 className="font-medium text-sm mb-1">{task.title}</h4>
          {task.description && <p className="text-xs mb-2 truncate">{task.description}</p>}
          {task.dueDate && (
            <p className="text-xs text-red-500 dark:text-red-400 html.inverted:text-orange-400">
              Vencimento: {formatDate(task.dueDate)}
            </p>
          )}
        </div>
        {!isOverlay && (
          <div {...attributes} {...listeners} className="absolute top-1 right-1 p-1 cursor-grab text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 html.inverted:text-gray-400 html.inverted:hover:text-gray-200">
            <GripVertical size={16} />
          </div>
        )}
      </div>
       {!isOverlay && (onDelete || onArchive) && (
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-0.5">
          {onArchive && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onArchive(); }} title="Arquivar">
              <Archive className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 html.inverted:text-amber-500" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Excluir">
              <Trash2 className="h-3.5 w-3.5 text-red-500 dark:text-red-400 html.inverted:text-red-400" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const KanbanCard = React.memo(KanbanCardComponent);
export default KanbanCard;