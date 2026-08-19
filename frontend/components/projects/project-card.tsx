'use client';

import Link from 'next/link';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/task.types';

export function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <Link href={`/projects/${project.id}`} className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.key}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground">{project._count?.tasks ?? 0} tasks</p>
            </div>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      {project.description && (
        <CardContent className="pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        </CardContent>
      )}
    </Card>
  );
}
