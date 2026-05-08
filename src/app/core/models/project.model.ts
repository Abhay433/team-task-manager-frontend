export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  teamId: number;
  createdById: number;
  createdAt?: string;
  updatedAt?: string;
}
