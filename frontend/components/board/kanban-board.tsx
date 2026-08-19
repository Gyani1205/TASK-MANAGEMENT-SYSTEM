'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { useReorderTask } from '@/hooks/use-tasks';
import { TASK_STATUSES, TASK_STATUS_LABELS } from '@/lib/constants';
import type { Task, TaskStatus } from '@/types/task.types';
import type { TaskQueryParams } from '@/services/task.service';
import type { FieldVisibility } from '@/services/settings.service';

export function KanbanBoard({
  tasks,
  queryParams,
  onAddTask,
  onTaskClick,
  visibility,
}: {
  tasks: Task[];
  queryParams: TaskQueryParams;
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  visibility?: FieldVisibility;
}) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const reorder = useReorderTask(queryParams);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const grouped = useMemo(() => {
    const map = {} as Record<TaskStatus, Task[]>;
    for (const status of TASK_STATUSES) {
      map[status] = tasks.filter((t) => t.status === status).sort((a, b) => a.position - b.position);
    }
    return map;
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const dragged = tasks.find((t) => t.id === activeId);
    if (!dragged) return;

    const isOverColumn = (TASK_STATUSES as readonly string[]).includes(overId);

    let targetStatus: TaskStatus;
    let targetIndex: number;

    if (isOverColumn) {
      targetStatus = overId as TaskStatus;
      targetIndex = grouped[targetStatus].length;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      targetStatus = overTask.status;
      targetIndex = grouped[targetStatus].findIndex((t) => t.id === overId);
    }

    if (targetStatus === dragged.status && targetIndex === dragged.position) return;

    reorder.mutate({ id: activeId, status: targetStatus, position: targetIndex });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            label={TASK_STATUS_LABELS[status]}
            tasks={grouped[status]}
            onAddTask={() => onAddTask(status)}
            onTaskClick={onTaskClick}
            visibility={visibility}
          />
        ))}
      </div>
      <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
}
