import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Dashboard } from '../types/dashboard';

export function useFirestoreDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dashboards em tempo real
  useEffect(() => {
    const dashboardsRef = collection(db, 'dashboards');
    const q = query(dashboardsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dashboardsData: Dashboard[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dashboardsData.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          url: data.url,
          category: data.category,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
        });
      });
      setDashboards(dashboardsData);
      setIsLoading(false);
    }, (error) => {
      console.error('Erro ao carregar dashboards:', error);
      setError('Erro ao carregar dashboards');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Adicionar dashboard
  const addDashboard = async (data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, 'dashboards'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Erro ao adicionar dashboard:', err);
      setError('Erro ao adicionar dashboard');
      throw err;
    }
  };

  // Atualizar dashboard
  const updateDashboard = async (id: string, data: Partial<Dashboard>) => {
    try {
      setError(null);
      const dashboardRef = doc(db, 'dashboards', id);
      await updateDoc(dashboardRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);
      setError('Erro ao atualizar dashboard');
      throw err;
    }
  };

  // Remover dashboard
  const removeDashboard = async (id: string) => {
    try {
      setError(null);
      const dashboardRef = doc(db, 'dashboards', id);
      await deleteDoc(dashboardRef);
    } catch (err) {
      console.error('Erro ao remover dashboard:', err);
      setError('Erro ao remover dashboard');
      throw err;
    }
  };

  // Backup (exportar todos os dashboards)
  const exportDashboards = () => {
    return JSON.stringify(dashboards, null, 2);
  };

  // Restore (importar dashboards)
  const importDashboards = async (jsonData: string) => {
    try {
      setError(null);
      const data = JSON.parse(jsonData);
      
      if (!Array.isArray(data)) {
        throw new Error('Formato inválido');
      }

      // Limpar dashboards existentes
      for (const dashboard of dashboards) {
        await removeDashboard(dashboard.id);
      }

      // Adicionar novos dashboards
      for (const dashboard of data) {
        const { id, createdAt, updatedAt, ...dashboardData } = dashboard;
        await addDashboard(dashboardData);
      }
    } catch (err) {
      console.error('Erro ao importar dashboards:', err);
      setError('Erro ao importar dashboards');
      throw err;
    }
  };

  return {
    dashboards,
    isLoading,
    error,
    addDashboard,
    updateDashboard,
    removeDashboard,
    exportDashboards,
    importDashboards,
  };
} 