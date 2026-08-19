export type TaskStatus = 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskAssignee {
  id: string;
  user: { id: string; name: string; username: string; avatarUrl?: string | null };
}

export interface TaskLabel {
  id: string;
  label: { id: string; name: string; color: string };
}

export interface Subtask {
  id: string;
  title: string;
  isDone: boolean;
  position: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  position: number;
  projectId: string;
  reporter: { id: string; name: string; username: string; avatarUrl?: string | null };
  assignees: TaskAssignee[];
  labels: TaskLabel[];
  subtasks: Subtask[];
  _count: { comments: number; subtasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  color: string;
  workspaceId: string;
  _count?: { tasks: number };
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { projects: number; members: number };
}

export interface CommentAuthor {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
}

export interface Comment {
  id: string;
  body: string;
  taskId: string;
  authorId: string;
  parentId?: string | null;
  author: CommentAuthor;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'PRIORITY_CHANGED'
  | 'STATUS_CHANGED'
  | 'MEMBER_CHANGED'
  | 'COMMENT_ADDED'
  | 'SUBTASK_ADDED'
  | 'SUBTASK_COMPLETED'
  | 'LABEL_ADDED'
  | 'LABEL_REMOVED'
  | 'DUE_DATE_CHANGED';

export interface ActivityLogEntry {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
  user: { id: string; name: string; username: string; avatarUrl?: string | null };
}

export interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface SearchUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
}
