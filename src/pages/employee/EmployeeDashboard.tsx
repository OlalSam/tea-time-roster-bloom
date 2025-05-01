import React from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import UpcomingShiftCard from '@/components/employee/UpcomingShiftCard';
import WeeklyScheduleCard from '@/components/employee/WeeklyScheduleCard';
import LeaveRequestCard from '@/components/employee/LeaveRequestCard';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useScheduleData } from '@/hooks/useScheduleData';
import EmployeeStats from '@/components/employee/EmployeeStats';
import ClockInOutCard from '@/components/employee/ClockInOutCard';


const EmployeeDashboard: React.FC = () => {
  const { employee, department, isLoading: isEmployeeLoading } = useEmployeeData();
  const { shifts, isLoading: isScheduleLoading } = useScheduleData();

  const isLoading = isEmployeeLoading || isScheduleLoading;

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest"></div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, {employee?.first_name}</h1>
          <p className="text-muted-foreground">{department?.name} Department</p>
        </div>

        <EmployeeStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeeklyScheduleCard shifts={shifts} />
          <LeaveRequestCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpcomingShiftCard isToday={true} shifts={shifts} />
          <ClockInOutCard />
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;