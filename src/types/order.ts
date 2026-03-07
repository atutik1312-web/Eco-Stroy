export interface Order {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  message?: string;
  summary?: string;
  projectId?: string;
  projectTitle?: string;
  source: string;
  status: 'new' | 'in_progress' | 'done' | 'rejected';
  createdAt: number;
}
