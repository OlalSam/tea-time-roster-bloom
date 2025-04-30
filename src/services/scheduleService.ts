
import { supabase } from "@/integrations/supabase/client";
import { Schedule, ScheduleShift } from "@/types/database";
import { addDays, format, differenceInDays } from 'date-fns';

interface GenerateScheduleParams {
  department: string;
  startDate: Date;
  endDate: Date;
  preferences: {
    balanceWeekends: boolean;
    considerEmployeeRequests: boolean;
    optimizeForEfficiency: boolean;
  };
  shiftDistribution: {
    morningRatio: number;
    afternoonRatio: number;
    nightRatio: number;
  };
}

export async function generateSchedule(params: GenerateScheduleParams): Promise<Schedule> {
  try {
    // Step 1: Create the schedule record
    const scheduleName = `${params.department} Schedule (${format(params.startDate, 'MMM d')}-${format(params.endDate, 'MMM d, yyyy')})`;
    
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('schedules')
      .insert({
        name: scheduleName,
        department_id: params.department !== 'all' ? params.department : null,
        start_date: format(params.startDate, 'yyyy-MM-dd'),
        end_date: format(params.endDate, 'yyyy-MM-dd')
      })
      .select()
      .single();

    if (scheduleError) throw scheduleError;
    
    // Step 2: Fetch employees for this department or all departments
    const employeeQuery = supabase
      .from('employees')
      .select('*');
      
    if (params.department !== 'all') {
      employeeQuery.eq('department_id', params.department);
    }
    
    const { data: employees, error: employeesError } = await employeeQuery;
    if (employeesError) throw employeesError;
    
    // Step 3: Fetch shift types
    const { data: shiftTypes, error: shiftTypesError } = await supabase
      .from('shift_types')
      .select('*');
      
    if (shiftTypesError) throw shiftTypesError;
    
    // Step 4: Generate the schedule shifts
    if (employees && employees.length > 0 && shiftTypes && shiftTypes.length > 0) {
      const shifts: Omit<ScheduleShift, 'id' | 'created_at' | 'updated_at'>[] = [];
      
      // Calculate the number of days in the schedule period
      const dayCount = differenceInDays(params.endDate, params.startDate) + 1;
      
      // Simple algorithm to distribute shifts among employees based on params
      for (let i = 0; i < dayCount; i++) {
        const currentDate = addDays(params.startDate, i);
        const currentDateStr = format(currentDate, 'yyyy-MM-dd');
        const isWeekend = [0, 6].includes(currentDate.getDay()); // 0 = Sunday, 6 = Saturday
        
        // Calculate how many employees we need for each shift type based on distribution
        const totalEmployees = employees.length;
        const morningCount = Math.round(totalEmployees * (params.shiftDistribution.morningRatio / 100));
        const afternoonCount = Math.round(totalEmployees * (params.shiftDistribution.afternoonRatio / 100));
        const nightCount = Math.round(totalEmployees * (params.shiftDistribution.nightRatio / 100));
        
        // Distribute shifts (this is a simple algorithm and can be improved)
        let employeeIndex = 0;
        
        // Morning shifts
        const morningShift = shiftTypes.find(shift => shift.name === 'Morning');
        for (let j = 0; j < morningCount && employeeIndex < employees.length; j++, employeeIndex++) {
          if (morningShift) {
            shifts.push({
              schedule_id: scheduleData.id,
              employee_id: employees[employeeIndex].id,
              shift_type_id: morningShift.id,
              shift_date: currentDateStr
            });
          }
        }
        
        // Afternoon shifts
        const afternoonShift = shiftTypes.find(shift => shift.name === 'Afternoon');
        for (let j = 0; j < afternoonCount && employeeIndex < employees.length; j++, employeeIndex++) {
          if (afternoonShift) {
            shifts.push({
              schedule_id: scheduleData.id,
              employee_id: employees[employeeIndex].id,
              shift_type_id: afternoonShift.id,
              shift_date: currentDateStr
            });
          }
        }
        
        // Night shifts
        const nightShift = shiftTypes.find(shift => shift.name === 'Night');
        for (let j = 0; j < nightCount && employeeIndex < employees.length; j++, employeeIndex++) {
          if (nightShift) {
            shifts.push({
              schedule_id: scheduleData.id,
              employee_id: employees[employeeIndex].id,
              shift_type_id: nightShift.id,
              shift_date: currentDateStr
            });
          }
        }
      }
      
      // Insert all shifts
      if (shifts.length > 0) {
        const { error: shiftsError } = await supabase
          .from('schedule_shifts')
          .insert(shifts);
          
        if (shiftsError) throw shiftsError;
      }
    }
    
    return scheduleData;
  } catch (error) {
    console.error('Error generating schedule:', error);
    throw error;
  }
}

export async function fetchSchedules(): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }

  return data || [];
}

export async function fetchScheduleById(id: string): Promise<Schedule> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }

  return data;
}

export async function fetchScheduleShifts(scheduleId: string): Promise<ScheduleShift[]> {
  const { data, error } = await supabase
    .from('schedule_shifts')
    .select('*')
    .eq('schedule_id', scheduleId);

  if (error) {
    console.error('Error fetching schedule shifts:', error);
    throw error;
  }

  return data || [];
}

export async function updateScheduleStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
  const { error } = await supabase
    .from('schedules')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating schedule status:', error);
    throw error;
  }
}
