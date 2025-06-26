
import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent, Active } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn as KanbanColumnType, Task, TaskStatus } from '@/types';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard'; // For DragOverlay
// import { Trash2, Archive } from 'lucide-react'; // Icons no longer needed here
// import { Button } from '@/components/ui/Button'; // Button no longer needed here

interface KanbanBoardProps {
  title: string;
  initialColumns: KanbanColumnType[];
  onTaskClick: (task: Task) => void;
  onTaskDelete?: (taskId: string, columnId: TaskStatus) => void; // Optional for now
  onTaskArchive?: (taskId: string, columnId: TaskStatus) => void; // Optional for now
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ title, initialColumns, onTaskClick, onTaskDelete, onTaskArchive }) => {
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null); // For DragOverlay

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require pointer to move 8px before initiating drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns.flatMap(col => col.tasks).find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return; // Dropped outside a valid target

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(col => col.tasks.some(task => task.id === activeId));
    const overColumnData = columns.find(col => col.id === overId || col.tasks.some(task => task.id === overId));
    
    if (!activeColumn || !overColumnData) return;

    const overColumnId = overColumnData.id; // This is the ID of the column itself
    const overIsColumn = overId === overColumnId; // True if dragging over a column, false if over a task

    setColumns(prevColumns => {
      let newColumns = [...prevColumns];
      const sourceColIndex = newColumns.findIndex(col => col.id === activeColumn.id);
      const targetColIndex = newColumns.findIndex(col => col.id === overColumnId);

      if (sourceColIndex === -1 || targetColIndex === -1) return prevColumns; // Should not happen

      const taskToMove = newColumns[sourceColIndex].tasks.find(task => task.id === activeId);
      if (!taskToMove) return prevColumns;
      
      // Remove from source column
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        tasks: newColumns[sourceColIndex].tasks.filter(task => task.id !== activeId),
      };

      // Update task status
      const updatedTask = { ...taskToMove, status: newColumns[targetColIndex].id };

      // Add to target column
      if (overIsColumn) { // Dropped onto a column header or empty column
        newColumns[targetColIndex] = {
          ...newColumns[targetColIndex],
          tasks: [...newColumns[targetColIndex].tasks, updatedTask],
        };
      } else { // Dropped onto another task within a column
        const overTaskIndex = newColumns[targetColIndex].tasks.findIndex(task => task.id === overId);
        if (overTaskIndex !== -1) {
          newColumns[targetColIndex].tasks.splice(overTaskIndex, 0, updatedTask);
        } else { // Fallback: add to end of column if overTaskIndex is not found (shouldn't happen)
          newColumns[targetColIndex].tasks.push(updatedTask);
        }
      }
      return newColumns;
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
          {/* Removed mass action buttons */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Adjusted for 4 columns on large screens */}
          {columns.map((column) => (
            <SortableContext key={column.id} items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              <KanbanColumn
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                onTaskClick={onTaskClick}
                onTaskDelete={onTaskDelete ? (taskId) => onTaskDelete(taskId, column.id) : undefined}
                onTaskArchive={onTaskArchive ? (taskId) => onTaskArchive(taskId, column.id) : undefined}
              />
            </SortableContext>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isOverlay onClick={() => {}} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;