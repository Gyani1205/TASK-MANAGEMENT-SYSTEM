'use client';

import { MessageSquare } from 'lucide-react';
import { CommentComposer } from './comment-composer';
import { CommentItem } from './comment-item';
import { useComments, useCreateComment } from '@/hooks/use-comments';
import { Skeleton } from '@/components/ui/skeleton';

export function CommentThread({ taskId }: { taskId: string }) {
  const { data: comments, isLoading } = useComments(taskId);
  const createComment = useCreateComment(taskId);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Comments {comments && `(${comments.length})`}</h3>

      <CommentComposer submitting={createComment.isPending} onSubmit={(body) => createComment.mutate({ body })} />

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {!isLoading && comments?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
          <MessageSquare className="h-8 w-8" />
          <p className="text-sm">No comments yet — be the first to say something.</p>
        </div>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} taskId={taskId} />
        ))}
      </div>
    </div>
  );
}
