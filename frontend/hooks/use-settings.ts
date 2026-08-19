'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsService, type FieldVisibility } from '@/services/settings.service';

export function useFieldVisibility() {
  return useQuery({ queryKey: ['field-visibility'], queryFn: settingsService.getFieldVisibility });
}

export function useUpdateFieldVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<FieldVisibility>) => settingsService.updateFieldVisibility(payload),
    // Optimistic toggle so switches feel instant.
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['field-visibility'] });
      const previous = queryClient.getQueryData<FieldVisibility>(['field-visibility']);
      if (previous) queryClient.setQueryData(['field-visibility'], { ...previous, ...payload });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['field-visibility'], context.previous);
      toast.error('Could not save preference');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['field-visibility'] }),
  });
}
