
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useScheduleData } from '@/hooks/useScheduleData';

const EmployeeStats: React.FC = () => {
  const { employee } = useEmployeeData();
  const { shifts } = useScheduleData();

  const totalHoursThisWeek = shifts?.reduce((acc, shift) => {
    const duration = new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime();
    return acc + (duration / (1000 * 60 * 60));
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
