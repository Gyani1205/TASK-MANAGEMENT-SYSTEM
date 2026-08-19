'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export function EditableDescription({ value, onSave }: { value: string; onSave: (next: string) => void }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  function commit() {
    if (draft !== value) onSave(draft);
  }

  return (
    <Textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      placeholder="Add a description..."
      rows={4}
      className="text-sm"
    />
  );
}
