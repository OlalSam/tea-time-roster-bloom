
import { supabase } from "@/integrations/supabase/client";

export interface ClockRecord {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  total_hours: number | null;
  created_at: string;
}

export async function clockIn(employeeId: string) {
  const { data, error } = await supabase
    .from('clock_records')
    .insert({
      employee_id: employeeId,
      clock_in: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function clockOut(recordId: string) {
  const clockOut = new Date().toISOString();
  const { data: record } = await supabase
    .from('clock_records')
    .select('clock_in')
    .eq('id', recordId)
    .single();

  const totalHours = record ? 
    (new Date(clockOut).getTime() - new Date(record.clock_in).getTime()) / (1000 * 60 * 60) : 
    0;

  const { error } = await supabase
    .from('clock_records')
    .update({
      clock_out: clockOut,
      total_hours: totalHours
    })
    .eq('id', recordId);

  if (error) throw error;
}

export async function getActiveClockRecord(employeeId: string) {
  const { data, error } = await supabase
    .from('clock_records')
    .select('*')
    .eq('employee_id', employeeId)
    .is('clock_out', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getWeeklyHours(employeeId: string) {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  const { data, error } = await supabase
    .from('clock_records')
    .select('total_hours, clock_in')
    .eq('employee_id', employeeId)
    .gte('clock_in', startOfWeek.toISOString());

  if (error) throw error;
  return data;
}
