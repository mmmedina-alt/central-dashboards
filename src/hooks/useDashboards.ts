import { useState, useEffect } from 'react';
import { Dashboard, BackupData } from '../types/dashboard';

const STORAGE_KEY = 'dashboard-manager-data';

// Dados iniciais dos dashboards
const initialDashboards: Dashboard[] = [
  {
    id: '1',
    title: 'Portal de Editais CNPq',
    description: 'Acesso direto ao portal de editais do Conselho Nacional de Desenvolvimento Científico e Tecnológico',
    url: 'https://www.gov.br/cnpq/pt-br/acesso-a-informacao/acoes-e-programas/programas/programa-de-bolsas-de-mestrado-e-doutorado',
    category: 'CNPq',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Editais CAPES',
    description: 'Portal de editais da Coordenação de Aperfeiçoamento de Pessoal de Nível Superior',
    url: 'https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/bolsas',
    category: 'CAPES',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'FAPESP - Fundação de Amparo à Pesquisa',
    description: 'Editais e oportunidades da Fundação de Amparo à Pesquisa do Estado de São Paulo',
    url: 'https://fapesp.br/oportunidades',
    category: 'FAPESP',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '4',
    title: 'Portal de Editais MCTI',
    description: 'Ministério da Ciência, Tecnologia e Inovações - Editais e oportunidades',
    url: 'https://www.gov.br/mcti/pt-br/acesso-a-informacao/acoes-e-programas/editais',
    category: 'MCTI',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '5',
    title: 'FINEP - Financiadora de Estudos e Projetos',
    description: 'Editais e programas de financiamento da FINEP',
    url: 'https://www.gov.br/finep/pt-br/acesso-a-informacao/acoes-e-programas',
    category: 'FINEP',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '6',
    title: 'BNDES - Banco Nacional de Desenvolvimento',
    description: 'Programas de apoio e editais do BNDES',
    url: 'https://www.bndes.gov.br/wps/portal/site/home/transparencia/contratos-e-convenios',
    category: 'BNDES',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
]

export function useDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados iniciais na primeira vez
  useEffect(() => {
    const savedDashboards = localStorage.getItem('dashboards');
    if (savedDashboards) {
      setDashboards(JSON.parse(savedDashboards));
    } else {
      // Se não há dados salvos, usar os dados iniciais
      setDashboards(initialDashboards);
      localStorage.setItem('dashboards', JSON.stringify(initialDashboards));
    }
    setIsLoading(false);
  }, []);

  // Salvar dados no localStorage
  const saveDashboards = (newDashboards: Dashboard[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dashboards: newDashboards }));
      setDashboards(newDashboards);
    } catch (err) {
      setError('Erro ao salvar dashboards');
    }
  };

  // Adicionar novo dashboard
  const addDashboard = async (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedDashboards = [...dashboards, newDashboard]
    setDashboards(updatedDashboards)
    localStorage.setItem('dashboards', JSON.stringify(updatedDashboards))
  }

  // Atualizar dashboard existente
  const updateDashboard = async (id: string, updates: Partial<Dashboard>) => {
    const updatedDashboards = dashboards.map(dashboard =>
      dashboard.id === id
        ? { ...dashboard, ...updates, updatedAt: new Date().toISOString() }
        : dashboard
    )
    setDashboards(updatedDashboards)
    localStorage.setItem('dashboards', JSON.stringify(updatedDashboards))
  }

  // Remover dashboard
  const removeDashboard = (id: string) => {
    const filtered = dashboards.filter(dash => dash.id !== id);
    saveDashboards(filtered);
  };

  // Exportar dados para backup
  const exportData = (): BackupData => {
    return {
      dashboards,
      categories: [], // Será implementado posteriormente
      lastUpdated: new Date().toISOString(),
    };
  };

  // Importar dados de backup
  const importData = (data: BackupData) => {
    try {
      saveDashboards(data.dashboards);
      // Implementar importação de categorias posteriormente
      return true;
    } catch (err) {
      setError('Erro ao importar dados');
      return false;
    }
  };

  // Download do backup como arquivo JSON
  const downloadBackup = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erro ao gerar backup');
    }
  };

  return {
    dashboards,
    isLoading,
    error,
    addDashboard,
    updateDashboard,
    removeDashboard,
    exportData,
    importData,
    downloadBackup,
  };
} 