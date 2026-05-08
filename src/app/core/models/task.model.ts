import { User } from './user.model';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  projectId: number;
  assignedToId?: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: Partial<User>;
  createdBy?: Partial<User>;
}
