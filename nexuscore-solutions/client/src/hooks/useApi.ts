import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { ApiResponse } from '@/types';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = <T,>(url: string, options?: UseApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApiResponse<T>>(url);
      setData(response.data.data || null);
      options?.onSuccess?.(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};