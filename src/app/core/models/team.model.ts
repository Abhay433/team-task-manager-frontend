export interface Team {
  id: number;
  name: string;
  createdById: number;
  memberCount?: number;
  projectCount?: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
}
