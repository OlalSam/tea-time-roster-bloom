
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useScheduleData } from '@/hooks/useScheduleData';

const EmployeeStats: React.FC = () => {
  const { employee, department, error: employeeError } = useEmployeeData();
  const { shifts, error: shiftsError } = useScheduleData();

  useEffect(() => {
    if (employeeError) {
      console.error('Error fetching employee data:', employeeError);
    }
    if (shiftsError) {
      console.error('Error fetching shifts data:', shiftsError);
    }
  }, [employeeError, shiftsError]);

  const totalHoursThisWeek = shifts?.reduce((acc, shift) => {
    if (shift && shift.shift_types) {
      const startTime = new Date(`2000-01-01T${shift.shift_types.start_time}`);
      const endTime = new Date(`2000-01-01T${shift.shift_types.end_time}`);
      let duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      // If end time is before start time, it means the shift crosses midnight
      if (duration < 0) {
        duration += 24;
      }
      
      return acc + duration;
    }
    return acc;
  }, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{totalHoursThisWeek.toFixed(1)}h</div>
          <p className="text-sm text-muted-foreground">Hours This Week</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{shifts?.length || 0}</div>
          <p className="text-sm text-muted-foreground">Upcoming Shifts</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{employee?.leave_balance || 0}</div>
          <p className="text-sm text-muted-foreground">Leave Balance</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeStats;
