
import { supabase } from "@/integrations/supabase/client";
import { ShiftType } from "@/types/database";

export async function fetchShiftTypes(): Promise<ShiftType[]> {
  const { data, error } = await supabase
    .from('shift_types')
    .select('*');

  if (error) {
    console.error('Error fetching shift types:', error);
    throw error;
  }

  return data || [];
}
