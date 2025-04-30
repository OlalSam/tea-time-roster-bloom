import { supabase } from "@/integrations/supabase/client";
import { Schedule, ScheduleShift } from "@/types/database";
import { addDays, format, differenceInDays } from 'date-fns';

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

// Placeholder for fetching employee availability.  Replace with your actual implementation.
async function fetchEmployeeAvailability(employeeId: string): Promise<{ day_of_week: number; shift_type_id: string; preference: 'available' | 'preferred' | 'unavailable' }[]> {
  // Replace with your actual Supabase query to fetch employee availability
  // This example assumes a table named 'employee_availability' with columns: employee_id, day_of_week, shift_type_id, preference
  const { data, error } = await supabase
    .from('employee_availability')
    .select('*')
    .eq('employee_id', employeeId);

  if (error) {
    console.error('Error fetching employee availability:', error);
    throw error;
  }

  return data || [];
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

      // Calculate how many employees we need for each shift type based on distribution
      const totalEmployees = employees.length;
      const morningCount = Math.round(totalEmployees * (params.shiftDistribution.morningRatio / 100));
      const afternoonCount = Math.round(totalEmployees * (params.shiftDistribution.afternoonRatio / 100));
      const nightCount = Math.round(totalEmployees * (params.shiftDistribution.nightRatio / 100));

      // Sort employees by availability for each shift
      const getAvailableEmployees = (date: Date, shiftTypeId: string) => {
        return employees.sort((a, b) => {
          const aAvail = availabilityMap.get(a.id)?.find(
            av => av.day_of_week === date.getDay() && av.shift_type_id === shiftTypeId
          )?.preference || 'available';
          const bAvail = availabilityMap.get(b.id)?.find(
            av => av.day_of_week === date.getDay() && av.shift_type_id === shiftTypeId
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
            shifts.push({
              schedule_id: scheduleData.id,
              employee_id: availableEmployees[j].id,
              shift_type_id: morningShift.id,
              shift_date: currentDateStr
            });
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
          email,
          first_name,
          last_name
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
    const employeeShifts = shifts?.reduce((acc: any, shift) => {
      const employeeId = shift.employee_id;
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employee: shift.employees,
          shifts: []
        };
      }
      acc[employeeId].shifts.push({
        shift_date: shift.shift_date,
        shift_type: shift.shift_types
      });
      return acc;
    }, {});

    // Send email to each employee
    for (const employeeId in employeeShifts) {
      const { employee, shifts } = employeeShifts[employeeId];
      await sendScheduleEmail(employee.email, { shifts });
    }

    // Send summary to admin
    const { data: adminEmails } = await supabase
      .from('employees')
      .select('email')
      .eq('role', 'admin');

    if (adminEmails) {
      for (const admin of adminEmails) {
        await sendScheduleEmail(admin.email, { 
          shifts: Object.values(employeeShifts).flatMap((e: any) => e.shifts),
          isAdminSummary: true 
        });
      }
    }
  } catch (error) {
    console.error('Error sending schedule notifications:', error);
    throw error;
  }
}