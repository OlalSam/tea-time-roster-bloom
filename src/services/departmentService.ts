
import { supabase } from "@/integrations/supabase/client";
import { Department } from "@/types/database";

export async function fetchDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('*');

  if (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }

  return data || [];
}
