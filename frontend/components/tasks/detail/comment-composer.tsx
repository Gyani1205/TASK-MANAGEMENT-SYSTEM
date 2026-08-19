'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function CommentComposer({
  onSubmit,
  placeholder = 'Write a comment...',
  autoFocus,
  submitting,
  compact,
}: {
  onSubmit: (body: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  submitting?: boolean;
  compact?: boolean;
}) {
  const [body, setBody] = useState('');

  function handleSubmit() {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setBody('');
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={compact ? 2 : 3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || submitting}>
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          {compact ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </div>
  );
}
