
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

export async function createLeaveRequest(request: {
  employee_id: string;
  type: string;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  reason: string;
}) {
  // Map form fields to database fields
  const payload = {
    employee_id: request.employee_id,
    type: request.type,
    start_date: request.start_date || request.startDate,
    end_date: request.end_date || request.endDate,
    reason: request.reason,
    status: 'pending' as const
  };

  const { data, error } = await supabase
    .from('leave_requests')
    .insert(payload)
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
        first_name,
        last_name,
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

// Add functions used in tests
export async function submitLeaveRequest(leaveData: any) {
  return await createLeaveRequest(leaveData);
}

export async function getLeaveBalance(employeeId: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('leave_balance')
    .eq('id', employeeId)
    .single();
    
  if (error) throw error;
  return data?.leave_balance || 0;
}
