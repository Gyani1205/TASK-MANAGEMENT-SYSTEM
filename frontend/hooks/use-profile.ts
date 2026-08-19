'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth-store';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: Partial<{ name: string; username: string; avatarUrl: string }>) => userService.updateMe(payload),
    onSuccess: (user) => {
      if (accessToken) setSession(user as any, accessToken);
      queryClient.setQueryData(['me'], user);
      toast.success('Profile updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Could not update profile'),
  });
}

export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => userService.deleteMe(),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      toast.success('Account deleted');
      router.push('/signup');
    },
    onError: () => toast.error('Could not delete account'),
  });
}
