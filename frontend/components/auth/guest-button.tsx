'use client';

import { Loader2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGuestLogin } from '@/hooks/use-auth';

export function GuestButton() {
  const guestLogin = useGuestLogin();

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      disabled={guestLogin.isPending}
      onClick={() => guestLogin.mutate()}
    >
      {guestLogin.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
      Continue as Guest
    </Button>
  );
}
