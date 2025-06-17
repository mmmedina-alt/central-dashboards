export interface Dashboard {
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type DashboardFormData = Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>;

export interface DashboardCategory {
  id: string;
  name: string;
  color: string;
}

export interface BackupData {
  dashboards: Dashboard[];
  categories: DashboardCategory[];
  lastUpdated: string;
} 