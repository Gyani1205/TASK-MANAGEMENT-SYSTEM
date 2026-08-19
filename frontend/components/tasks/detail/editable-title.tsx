'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export function EditableTitle({ value, onSave }: { value: string; onSave: (next: string) => void }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
  }

  return (
    <Textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          (e.target as HTMLTextAreaElement).blur();
        }
      }}
      rows={1}
      className="resize-none border-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
    />
  );
}
