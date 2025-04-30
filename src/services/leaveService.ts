
import { supabase } from "@/integrations/supabase/client";

export interface LeaveRequest {
  id: string;
  employee_id: string;
  type: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'declined';
  reason: string;
  created_at: string;
}

export async function createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status' | 'created_at'>) {
  const { data, error } = await supabase
    .from('leave_requests')
    .insert({
      ...request,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchEmployeeLeaveRequests(employeeId: string) {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchPendingLeaveRequests() {
  const { data, error } = await supabase
    .from('leave_requests')
    .select(`
      *,
      employees (
        id,
        name,
        department_id
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateLeaveRequestStatus(id: string, status: 'approved' | 'declined') {
  const { error } = await supabase
    .from('leave_requests')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}
