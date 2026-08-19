'use client';

import { useEffect } from 'react';
import { ChevronsUpDown, Check, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useWorkspaces, useCreateWorkspace } from '@/hooks/use-workspaces';
import { useWorkspaceStore } from '@/store/workspace-store';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function WorkspaceSwitcher({
  collapsed,
}: {
  collapsed?: boolean;
}) {
  const { data: workspaces, isLoading } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );

  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );

  // Automatically select the first workspace
  useEffect(() => {
    if (
      workspaces &&
      workspaces.length > 0 &&
      !currentWorkspaceId
    ) {
      setCurrentWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, currentWorkspaceId, setCurrentWorkspaceId]);

  const handleCreateWorkspace = () => {
    const name = window.prompt('Enter workspace name');

    if (!name || name.trim().length < 2) {
      return;
    }

    createWorkspace.mutate(
      {
        name: name.trim(),
        description: 'My TaskFlow workspace',
      },
      {
        onSuccess: (workspace) => {
          if (workspace?.id) {
            setCurrentWorkspaceId(workspace.id);
          }
        },
      },
    );
  };

  const current =
    workspaces?.find(
      (workspace) => workspace.id === currentWorkspaceId,
    ) ?? workspaces?.[0];

  if (isLoading) {
    return (
      <div className="px-2">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="px-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex w-full items-center gap-2 rounded-md border bg-background px-2.5 py-2 text-sm hover:bg-muted',
              collapsed && 'justify-center px-1.5',
            )}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
              {current?.name?.[0]?.toUpperCase() ?? 'W'}
            </div>

            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left font-medium">
                  {current?.name ?? 'No workspace'}
                </span>

                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-64"
        >
          <DropdownMenuLabel>
            Workspaces
          </DropdownMenuLabel>

          {workspaces?.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() =>
                setCurrentWorkspaceId(workspace.id)
              }
            >
              <span className="flex-1 truncate">
                {workspace.name}
              </span>

              {workspace.id === currentWorkspaceId && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleCreateWorkspace}
            disabled={createWorkspace.isPending}
          >
            <Plus className="h-4 w-4" />

            {createWorkspace.isPending
              ? 'Creating...'
              : 'New workspace'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}