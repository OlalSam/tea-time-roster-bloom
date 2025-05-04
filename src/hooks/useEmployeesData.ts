import { useState, useEffect } from 'react';
import { getEmployees } from '@/services/employeeService';
import type { Employee } from '@/types/database';

export const useEmployeesData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error('Error in useEmployeesData hook:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch employees'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, isLoading, error };
};
