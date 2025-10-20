import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Project, ApiResponse, Industry } from '@/types';

export const useProjects = (filters?: { industry?: Industry; featured?: boolean }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters?.industry) params.append('industry', filters.industry);
        if (filters?.featured !== undefined) params.append('featured', String(filters.featured));

        const response = await api.get<ApiResponse<Project[]>>(`/projects?${params}`);
        setProjects(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters?.industry, filters?.featured]);

  return { projects, loading, error };
};
