'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommentComposer } from './comment-composer';
import { useAuthStore } from '@/store/auth-store';
import { useCreateComment, useDeleteComment } from '@/hooks/use-comments';
import type { Comment } from '@/types/task.types';

export function CommentItem({ comment, taskId }: { comment: Comment; taskId: string }) {
  const [replying, setReplying] = useState(false);
  const currentUser = useAuthStore((s) => s.user);
  const createComment = useCreateComment(taskId);
  const deleteComment = useDeleteComment(taskId);

  const isOwn = currentUser?.id === comment.authorId;

  return (
    <div className="flex gap-3">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={comment.author.avatarUrl ?? undefined} />
        <AvatarFallback className="text-[10px]">{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm">{comment.body}</p>

        <div className="flex items-center gap-3 pt-0.5">
          <button onClick={() => setReplying((v) => !v)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
            Reply
          </button>
          {isOwn && (
            <button
              onClick={() => deleteComment.mutate(comment.id)}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          )}
        </div>

        {replying && (
          <div className="pt-2">
            <CommentComposer
              compact
              autoFocus
              submitting={createComment.isPending}
              placeholder={`Reply to ${comment.author.name}...`}
              onSubmit={(body) =>
                createComment.mutate(
                  { body, parentId: comment.id },
                  { onSuccess: () => setReplying(false) },
                )
              }
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l pl-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} taskId={taskId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
