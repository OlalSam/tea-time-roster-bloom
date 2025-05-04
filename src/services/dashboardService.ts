import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface DashboardStats {
  totalEmployees: number;
  activeShiftsToday: number;
  pendingLeaveRequests: number;
  uncoveredShifts: number;
  employeeTrend: {
    value: number;
    positive: boolean;
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Fetch all required stats in parallel
  const [
    { count: totalEmployees, error: employeesError },
    { count: lastMonthEmployees, error: lastMonthError },
    { count: activeShifts, error: shiftsError },
    { count: pendingLeaves, error: leavesError },
    { count: uncoveredShifts, error: uncoveredError }
  ] = await Promise.all([
    // Total employees
    supabase
      .from('employees')
      .select('*', { count: 'exact', head: true }),
    
    // Last month's employee count for trend
    supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd')),
    
    // Active shifts today
    supabase
      .from('schedule_shifts')
      .select('*', { count: 'exact', head: true })
      .eq('shift_date', today),
    
    // Pending leave requests
    supabase
      .from('leave_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    
    // Uncovered shifts (where employee_id is null)
    supabase
      .from('schedule_shifts')
      .select('*', { count: 'exact', head: true })
      .is('employee_id', null)
      .gte('shift_date', today)
  ]);

  if (employeesError) throw employeesError;
  if (lastMonthError) throw lastMonthError;
  if (shiftsError) throw shiftsError;
  if (leavesError) throw leavesError;
  if (uncoveredError) throw uncoveredError;

  // Calculate employee trend
  const employeeDifference = totalEmployees - (lastMonthEmployees || 0);

  return {
    totalEmployees: totalEmployees || 0,
    activeShiftsToday: activeShifts || 0,
    pendingLeaveRequests: pendingLeaves || 0,
    uncoveredShifts: uncoveredShifts || 0,
    employeeTrend: {
      value: Math.abs(employeeDifference),
      positive: employeeDifference >= 0
    }
  };
} 