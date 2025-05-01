
import { supabase } from "@/integrations/supabase/client";
import { Employee, EmployeeAvailability } from "@/types/database";

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

export async function fetchEmployeeAvailability(employeeId: string): Promise<EmployeeAvailability[]> {
  const { data, error } = await supabase
    .from('employee_availability')
    .select('*')
    .eq('employee_id', employeeId);

  if (error) {
    console.error('Error fetching employee availability:', error);
    throw error;
  }

  return data as EmployeeAvailability[] || [];
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

export async function updateEmployeeAvailability(
  employeeId: string,
  availabilities: Omit<EmployeeAvailability, 'id' | 'employee_id' | 'created_at' | 'updated_at'>[]
): Promise<void> {
  const { error } = await supabase
    .from('employee_availability')
    .upsert(
      availabilities.map(a => ({
        employee_id: employeeId,
        ...a
      }))
    );

  if (error) {
    console.error('Error updating employee availability:', error);
    throw error;
  }
}
