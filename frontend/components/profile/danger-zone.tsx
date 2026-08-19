'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useDeleteAccount } from '@/hooks/use-profile';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/services/api-client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function DangerZone() {
  const { data: workspaces } = useWorkspaces();
  const currentWorkspaceId = useWorkspaceStore((s) => s.currentWorkspaceId);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const deleteAccount = useDeleteAccount();

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const currentWorkspace = workspaces?.find((w) => w.id === currentWorkspaceId);

  async function handleLeaveWorkspace() {
    if (!currentWorkspaceId || !user) return;
    setLeaving(true);
    try {
      await apiClient.delete(`/workspaces/${currentWorkspaceId}/members/${user.id}`);
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success(`Left "${currentWorkspace?.name}"`);
      setLeaveOpen(false);
    } catch {
      toast.error('Could not leave workspace');
    } finally {
      setLeaving(false);
    }
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>These actions are permanent and can't be undone.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">Remove workspace</p>
            <p className="text-xs text-muted-foreground">Leave "{currentWorkspace?.name ?? 'this workspace'}"</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLeaveOpen(true)} disabled={!currentWorkspaceId}>
            Leave
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-md border border-destructive/40 p-3">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </CardContent>

      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Leave this workspace?"
        description={`You'll lose access to "${currentWorkspace?.name ?? 'this workspace'}" and its projects.`}
        confirmLabel="Leave workspace"
        destructive
        loading={leaving}
        onConfirm={handleLeaveWorkspace}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your account?"
        description="This permanently deletes your account. This can't be undone."
        confirmLabel="Delete account"
        destructive
        loading={deleteAccount.isPending}
        onConfirm={() => deleteAccount.mutate()}
      />
    </Card>
  );
}
