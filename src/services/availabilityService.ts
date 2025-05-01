
// Placeholder for availabilityService used in tests
import { supabase } from "@/integrations/supabase/client";
import { EmployeeAvailability } from "@/types/database";

export async function updateAvailability(data: any) {
  const { error } = await supabase
    .from('employee_availability')
    .upsert(data);

  if (error) throw error;
  return { data, error: null };
}

export async function getAvailability(employeeId: string) {
  const { data, error } = await supabase
    .from('employee_availability')
    .select('*')
    .eq('employee_id', employeeId);

  if (error) throw error;
  return data as EmployeeAvailability[];
}
