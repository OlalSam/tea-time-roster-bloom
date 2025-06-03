import { supabase } from "@/integrations/supabase/client";
import { Employee, EmployeeAvailability } from "@/types/database";

export class EmployeeDeletionError extends Error {
  constructor(
    message: string,
    public constraint?: string
  ) {
    super(message);
    this.name = 'EmployeeDeletionError';
  }
}

export async function getEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
    .from('employees')
      .select('*, departments(*)')
      .order('first_name');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
  }
  
    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
  const { data, error } = await supabase
    .from('employees')
    .select('*, departments(*)')
    .eq('id', id)
    .single();

  if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
}

export async function updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
  try {
  const { data, error } = await supabase
    .from('employees')
      .update(employeeData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

export async function createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
  try {
  const { data, error } = await supabase
    .from('employees')
      .insert(employeeData)
    .select()
    .single();

  if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') { // Foreign key violation
        const pgError = error as { code: string; constraint?: string };
        throw new EmployeeDeletionError(
          'Cannot delete employee due to existing references',
          pgError.constraint
        );
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof EmployeeDeletionError) {
      throw error;
    }
    console.error('Error deleting employee:', error);
    throw new Error('Failed to delete employee');
  }
}

export async function updateEmployeeAvailability(
  employeeId: string,
  availability: {
    day_of_week: number;
    preference: 'preferred' | 'available' | 'unavailable';
    shift_type_id: string | null;
  }[]
): Promise<void> {
  // First, delete existing availability records
  const { error: deleteError } = await supabase
    .from('employee_availability')
    .delete()
    .eq('employee_id', employeeId);

  if (deleteError) {
    console.error('Error deleting existing availability:', deleteError);
    throw deleteError;
  }

  // Then, insert new availability records
  const { error: insertError } = await supabase
    .from('employee_availability')
    .insert(
      availability.map(record => ({
        employee_id: employeeId,
        day_of_week: record.day_of_week,
        preference: record.preference,
        shift_type_id: record.shift_type_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    );

  if (insertError) {
    console.error('Error inserting new availability:', insertError);
    throw insertError;
  }
}

export async function fetchEmployeeAvailability(
  employeeId: string
): Promise<{
  day_of_week: number;
  preference: string;
  shift_type_id: string;
  id: string;
  created_at: string;
  updated_at: string;
  employee_id: string;
}[]> {
  const { data, error } = await supabase
    .from('employee_availability')
    .select('*')
    .eq('employee_id', employeeId);

  if (error) {
    console.error('Error fetching employee availability:', error);
    throw error;
  }

  return data || [];
}
