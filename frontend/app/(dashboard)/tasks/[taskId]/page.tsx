'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EditableTitle } from '@/components/tasks/detail/editable-title';
import { EditableDescription } from '@/components/tasks/detail/editable-description';
import { TaskMetaPanel } from '@/components/tasks/detail/task-meta-panel';
import { SubtaskList } from '@/components/tasks/detail/subtask-list';
import { CommentThread } from '@/components/tasks/detail/comment-thread';
import { ActivityTimeline } from '@/components/tasks/detail/activity-timeline';
import { useTaskDetail, useUpdateTaskDetail, useDeleteTaskDetail } from '@/hooks/use-task-detail';

export default function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const { data: task, isLoading } = useTaskDetail(taskId);
  const updateTask = useUpdateTaskDetail(taskId);
  const deleteTask = useDeleteTaskDetail();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading || !task) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="h-4 w-4" /> Delete task
        </Button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <EditableTitle value={task.title} onSave={(title) => updateTask.mutate({ title })} />

          <EditableDescription
            value={task.description ?? ''}
            onSave={(description) => updateTask.mutate({ description })}
          />

          <Separator />

          <SubtaskList taskId={taskId} />

          <Separator />

          <CommentThread taskId={taskId} />
        </div>

        <div className="w-full space-y-6 lg:w-80">
          <TaskMetaPanel task={task} onUpdate={(payload) => updateTask.mutate(payload)} />
          <div className="rounded-lg border bg-card p-4">
            <ActivityTimeline taskId={taskId} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this task?"
        description="This permanently deletes the task, its subtasks, comments, and activity history. This can't be undone."
        confirmLabel="Delete task"
        destructive
        loading={deleteTask.isPending}
        onConfirm={() =>
          deleteTask.mutate(taskId, {
            onSuccess: () => router.push('/tasks'),
          })
        }
      />
    </div>
  );
}
