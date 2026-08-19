'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export function useUserSearch() {
  const [query, setQuery] = useState('');

  const result = useQuery({
    queryKey: ['user-search', query],
    queryFn: () => userService.search(query),
    enabled: query.length > 0,
  });

  return { query, setQuery, users: result.data ?? [], isLoading: result.isLoading };
}
