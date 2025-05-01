
import { useEffect, useState } from 'react';
import { fetchEmployees } from '@/services/employeeService';
import type { Employee } from '@/types/database';

export function useEmployeesData(departmentId?: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const data = await fetchEmployees(departmentId);
        setEmployees(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployeeData();
  }, [departmentId]);

  return { employees, isLoading, error };
}
