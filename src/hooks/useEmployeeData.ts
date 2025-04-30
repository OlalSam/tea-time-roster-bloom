
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Employee, Department } from '@/types/database';

export function useEmployeeData() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployeeData() {
      if (!user?.id) return;

      try {
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*, departments(*)')
          .eq('id', user.id)
          .single();

        if (employeeError) throw employeeError;
        
        setEmployee(employeeData);
        setDepartment(employeeData.departments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployeeData();
  }, [user?.id]);

  return { employee, department, isLoading, error };
}
