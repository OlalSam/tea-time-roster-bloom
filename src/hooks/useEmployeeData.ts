
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
        console.log("Fetching employee data for user:", user.id);
        
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*, departments(*)')
          .eq('id', user.id)
          .single();

        if (employeeError) {
          console.error("Error fetching employee:", employeeError);
          
          // Check if the error is a not found error
          if (employeeError.code === 'PGRST116') {
            // No matching row found - might be a new user
            console.log("No employee record found for this user. They might be new.");
          }
          
          throw employeeError;
        }
        
        if (employeeData) {
          console.log("Employee data retrieved:", employeeData);
          setEmployee(employeeData);
          setDepartment(employeeData.departments);
        }
      } catch (err) {
        console.error("Error in useEmployeeData hook:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch employee data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployeeData();
  }, [user?.id]);

  return { employee, department, isLoading, error };
}
