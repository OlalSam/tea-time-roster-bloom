
import React from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import UpcomingShiftCard from '@/components/employee/UpcomingShiftCard';
import WeeklyScheduleCard from '@/components/employee/WeeklyScheduleCard';
import LeaveRequestCard from '@/components/employee/LeaveRequestCard';

const EmployeeDashboard: React.FC = () => {
  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingShiftCard isToday={true} />
          <LeaveRequestCard />
        </div>
        
        <div className="mt-6">
          <WeeklyScheduleCard />
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
