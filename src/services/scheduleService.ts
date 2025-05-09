import { supabase } from "@/integrations/supabase/client";
import { Schedule, ScheduleShift, EmployeeAvailability } from "@/types/database";
import { addDays, format, differenceInDays } from 'date-fns';
import { sendScheduleEmail } from "@/services/emailService";

export interface GenerateScheduleParams {
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

// Fetch employee availability
async function fetchEmployeeAvailability(employeeId: string): Promise<EmployeeAvailability[]> {
  const { data, error } = await supabase
    .from('employee_availability')
    .select('*')
    .eq('employee_id', employeeId);

  if (error) {
    console.error('Error fetching employee availability:', error);
    throw error;
  }
  
  // Cast the data to ensure preference is properly typed
  return (data || []).map(item => ({
    ...item,
    preference: item.preference as 'preferred' | 'available' | 'unavailable'
  }));
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

      // Fetch availability for all employees
      const availabilityPromises = employees.map(emp => fetchEmployeeAvailability(emp.id));
      const allAvailabilities = await Promise.all(availabilityPromises);

      // Create availability lookup
      const availabilityMap = new Map();
      allAvailabilities.forEach((empAvail, index) => {
        availabilityMap.set(employees[index].id, empAvail);
      });

      // Calculate required employees per shift based on workload and distribution
      const calculateRequiredEmployees = (total: number, ratio: number, minRequired: number) => {
        const calculated = Math.round(total * (ratio / 100));
        return Math.max(calculated, minRequired);
      };

      const totalEmployees = employees.length;
      const MIN_EMPLOYEES_PER_SHIFT = 2;
      const morningCount = calculateRequiredEmployees(
        totalEmployees,
        params.shiftDistribution.morningRatio,
        MIN_EMPLOYEES_PER_SHIFT
      );
      const afternoonCount = calculateRequiredEmployees(
        totalEmployees,
        params.shiftDistribution.afternoonRatio,
        MIN_EMPLOYEES_PER_SHIFT
      );
      const nightCount = calculateRequiredEmployees(
        totalEmployees,
        params.shiftDistribution.nightRatio,
        MIN_EMPLOYEES_PER_SHIFT
      );

      // Track weekend assignments for fair rotation
      const weekendAssignments = new Map<string, number>();
      employees.forEach(emp => weekendAssignments.set(emp.id, 0));

      // Fetch active leave requests for the schedule period
      const { data: leaveRequests } = await supabase
        .from('leave_requests')
        .select('*')
        .gte('start_date', format(params.startDate, 'yyyy-MM-dd'))
        .lte('end_date', format(params.endDate, 'yyyy-MM-dd'))
        .eq('status', 'approved');

      // Check if employee is on leave
      const isOnLeave = (employeeId: string, date: Date) => {
        return leaveRequests?.some(leave => 
          leave.employee_id === employeeId &&
          new Date(leave.start_date) <= date &&
          new Date(leave.end_date) >= date
        ) ?? false;
      };

      // Validate employee rest periods, weekend rotation, and leave conflicts
      const isEmployeeAvailable = (employeeId: string, date: Date) => {
        // Check leave conflicts
        if (isOnLeave(employeeId, date)) return false;

        // Check rest periods
        const previousShifts = shifts.filter(s => 
          s.employee_id === employeeId && 
          new Date(s.shift_date).getTime() < date.getTime()
        );
        
        if (previousShifts.length > 0) {
          const lastShift = new Date(previousShifts[previousShifts.length - 1].shift_date);
          const hoursSinceLastShift = (date.getTime() - lastShift.getTime()) / (1000 * 60 * 60);
          if (hoursSinceLastShift < 12) return false;
        }

        // Check weekend fairness
        const isWeekend = [0, 6].includes(date.getDay());
        if (isWeekend) {
          const currentWeekendCount = weekendAssignments.get(employeeId) || 0;
          const avgWeekendCount = Math.round(Array.from(weekendAssignments.values()).reduce((a, b) => a + b, 0) / employees.length);
          if (currentWeekendCount > avgWeekendCount) return false;
        }

        return true;
      };

      // Sort employees by availability for each shift
      const getAvailableEmployees = (date: Date, shiftTypeId: string) => {
        return employees.filter(emp => isEmployeeAvailable(emp.id, date)).sort((a, b) => {
          const aAvail = availabilityMap.get(a.id)?.find(
            (av: EmployeeAvailability) => av.day_of_week === date.getDay() && av.shift_type_id === shiftTypeId
          )?.preference || 'available';
          const bAvail = availabilityMap.get(b.id)?.find(
            (av: EmployeeAvailability) => av.day_of_week === date.getDay() && av.shift_type_id === shiftTypeId
          )?.preference || 'available';

          if (aAvail === 'preferred' && bAvail !== 'preferred') return -1;
          if (bAvail === 'preferred' && aAvail !== 'preferred') return 1;
          if (aAvail === 'unavailable') return 1;
          if (bAvail === 'unavailable') return -1;
          return 0;
        });
      };

      // Distribute shifts (this is a simple algorithm and can be improved)
      for (let i = 0; i < dayCount; i++) {
        const currentDate = addDays(params.startDate, i);
        const currentDateStr = format(currentDate, 'yyyy-MM-dd');
        const isWeekend = [0, 6].includes(currentDate.getDay()); // 0 = Sunday, 6 = Saturday

        // Morning shifts
        const morningShift = shiftTypes.find(shift => shift.name === 'Morning');
        if (morningShift) {
          const availableEmployees = getAvailableEmployees(currentDate, morningShift.id);
          for (let j = 0; j < morningCount && j < availableEmployees.length; j++) {
            const employeeId = availableEmployees[j].id;
            shifts.push({
              schedule_id: scheduleData.id,
              employee_id: employeeId,
              shift_type_id: morningShift.id,
              shift_date: currentDateStr
            });
            
            // Update weekend assignment count
            if ([0, 6].includes(currentDate.getDay())) {
              weekendAssignments.set(employeeId, (weekendAssignments.get(employeeId) || 0) + 1);
            }
          }
        }

        // Afternoon shifts
        const afternoonShift = shiftTypes.find(shift => shift.name === 'Afternoon');
        if (afternoonShift) {
          const availableEmployees = getAvailableEmployees(currentDate, afternoonShift.id);
          for (let j = 0; j < afternoonCount && j < availableEmployees.length; j++) {
            shifts.push({
              schedule_id: scheduleData.id,
              employee_id: availableEmployees[j].id,
              shift_type_id: afternoonShift.id,
              shift_date: currentDateStr
            });
          }
        }

        // Night shifts
        const nightShift = shiftTypes.find(shift => shift.name === 'Night');
        if (nightShift) {
          const availableEmployees = getAvailableEmployees(currentDate, nightShift.id);
          for (let j = 0; j < nightCount && j < availableEmployees.length; j++) {
            shifts.push({
              schedule_id: scheduleData.id,
              employee_id: availableEmployees[j].id,
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

    return scheduleData as Schedule;
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

  return data as Schedule[];
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

  return data as Schedule;
}

export async function fetchScheduleShifts(scheduleId: string): Promise<ScheduleShift[]> {
  const { data, error } = await supabase
    .from('schedule_shifts')
    .select(`
      *,
      employees (
        id,
        first_name,
        last_name,
        position,
        departments (
          id,
          name
        )
      ),
      shift_types (
        id,
        name,
        start_time,
        end_time,
        color
      )
    `)
    .eq('schedule_id', scheduleId)
    .order('shift_date', { ascending: true });

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

  // Send email notifications if schedule is approved
  if (status === 'approved') {
    await sendScheduleNotifications(id);
  }
}

async function sendScheduleNotifications(scheduleId: string) {
  try {
    // Fetch schedule details with shifts and employees
    const { data: shifts, error: shiftsError } = await supabase
      .from('schedule_shifts')
      .select(`
        *,
        employees (
          id,
          first_name,
          last_name,
          email,
          role
        ),
        shift_types (
          name,
          start_time,
          end_time
        )
      `)
      .eq('schedule_id', scheduleId);

    if (shiftsError) throw shiftsError;

    // Group shifts by employee
    const employeeShifts: Record<string, any> = {};
    
    shifts?.forEach(shift => {
      const employeeId = shift.employee_id;
      if (!employeeShifts[employeeId]) {
        employeeShifts[employeeId] = {
          employee: shift.employees,
          shifts: []
        };
      }
      employeeShifts[employeeId].shifts.push({
        shift_date: shift.shift_date,
        shift_type: shift.shift_types
      });
    });

    console.log("Schedule notification prepared for employees:", Object.keys(employeeShifts).length);
    
    // Send emails to each employee
    for (const employeeId in employeeShifts) {
      const { employee, shifts } = employeeShifts[employeeId];
      
      if (employee?.email) {
        try {
          await sendScheduleEmail(employee.email, {
            shifts,
            isAdminSummary: false
          });
          console.log(`Sent schedule email to ${employee.first_name} ${employee.last_name} at ${employee.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${employee.first_name} ${employee.last_name}:`, error);
        }
      } else {
        console.warn(`No email found for employee ${employee?.first_name} ${employee?.last_name}`);
      }
    }

    // Send summary to admin employees
    const adminEmails = Object.values(employeeShifts)
      .filter(({ employee }) => employee?.role === 'admin' && employee?.email)
      .map(({ employee }) => employee.email);

    if (adminEmails.length > 0) {
      try {
        const formattedShifts = shifts?.map(shift => ({
          shift_date: shift.shift_date,
          shift_type: {
            name: shift.shift_types.name,
            start_time: shift.shift_types.start_time,
            end_time: shift.shift_types.end_time
          }
        })) || [];

        await sendScheduleEmail(adminEmails.join(','), {
          shifts: formattedShifts,
          isAdminSummary: true
        });
        console.log('Sent schedule summary to admin employees');
      } catch (error) {
        console.error('Failed to send admin summary:', error);
      }
    }
    
  } catch (error) {
    console.error('Error in schedule notifications:', error);
    throw error;
  }
}

export interface ShiftCount {
  shift_type: string;
  count: number;
}

export interface PendingSchedule {
  id: string;
  department_id: string;
  start_date: string;
  end_date: string;
  status: string;
  department: {
    name: string;
  };
  employee_count: number;
}

export const fetchTodayShiftCounts = async (): Promise<ShiftCount[]> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  try {
    const { data, error } = await supabase
      .from('schedule_shifts')
      .select(`
        shift_type_id,
        shift_types!shift_type_id(name)
      `)
      .eq('shift_date', today);

    if (error) throw error;
    
    // Group and count by shift type
    const counts = (data || []).reduce((acc: Record<string, number>, curr) => {
      const shiftType = curr.shift_types?.name || 'Unknown';
      acc[shiftType] = (acc[shiftType] || 0) + 1;
      return acc;
    }, {});

    // Convert to ShiftCount array
    return Object.entries(counts).map(([shift_type, count]) => ({
      shift_type,
      count
    }));
  } catch (error) {
    console.error('Error fetching today\'s shift counts:', error);
    throw error;
  }
};

export const fetchPendingSchedules = async (): Promise<PendingSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        id,
        department_id,
        start_date,
        end_date,
        status,
        department:departments(name),
        employee_count:schedule_shifts!inner(count)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;
    
    // Transform the data to match PendingSchedule interface
    return (data || []).map(schedule => ({
      ...schedule,
      employee_count: schedule.employee_count[0]?.count || 0
    }));
  } catch (error) {
    console.error('Error fetching pending schedules:', error);
    throw error;
  }
};
