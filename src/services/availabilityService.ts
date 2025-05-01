
// Updated availabilityService with better error handling and types
import { supabase } from "@/integrations/supabase/client";
import { EmployeeAvailability } from "@/types/database";

export async function updateAvailability(data: any) {
  try {
    const { data: updatedData, error } = await supabase
      .from('employee_availability')
      .upsert(data);

    if (error) throw error;
    return { data: updatedData || data, error: null };
  } catch (error) {
    console.error("Error updating availability:", error);
    return { data: null, error };
  }
}

export async function getAvailability(employeeId: string) {
  try {
    const { data, error } = await supabase
      .from('employee_availability')
      .select('*')
      .eq('employee_id', employeeId);

    if (error) throw error;
    
    // Cast the data to ensure it matches our type definition
    return (data || []).map(item => ({
      ...item,
      preference: item.preference as 'preferred' | 'available' | 'unavailable'
    })) as EmployeeAvailability[];
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
  }
}
