
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/database";

export async function fetchEmployees(departmentId?: string): Promise<Employee[]> {
  let query = supabase
    .from('employees')
    .select('*');
    
  if (departmentId && departmentId !== 'all') {
    query = query.eq('department_id', departmentId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }

  return data || [];
}

export async function createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
  const { data, error } = await supabase
    .from('employees')
    .insert(employee)
    .select()
    .single();

  if (error) {
    console.error('Error creating employee:', error);
    throw error;
  }

  return data;
}
