'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import type { LoginPayload, SignupPayload } from '@/types/auth.types';

export function useCurrentUser() {
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const user = await authService.me();
      if (accessToken) setSession(user, accessToken);
      return user;
    },
    retry: false,
  });
}

export function useSignup() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
      queryClient.setQueryData(['me'], data.user);
      toast.success(`Welcome to TaskFlow, ${data.user.name}!`);
      router.push('/tasks');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Could not create your account');
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
      queryClient.setQueryData(['me'], data.user);
      toast.success('Welcome back!');
      router.push('/tasks');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Invalid email or password');
    },
  });
}

export function useGuestLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: () => authService.guestLogin(),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
      queryClient.setQueryData(['me'], data.user);
      toast.success('Signed in as guest — your data is temporary.');
      router.push('/tasks');
    },
    onError: () => toast.error('Could not start a guest session'),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.push('/login');
    },
  });
}
