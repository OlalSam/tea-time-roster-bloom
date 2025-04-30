
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import ScheduleCard from '@/components/admin/ScheduleCard';
import LeaveRequestsCard from '@/components/admin/LeaveRequestsCard';
import SchedulesNeedingApproval from '@/components/admin/SchedulesNeedingApproval';
import { Users, Clock, Calendar, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Employees"
            value="126"
            icon={<Users size={20} />}
            trend={{ value: 4, positive: true }}
          />
          <StatCard 
            title="Active Shifts Today"
            value="35"
            icon={<Calendar size={20} />}
          />
          <StatCard 
            title="Pending Leave Requests"
            value="8"
            icon={<Clock size={20} />}
            trend={{ value: 2, positive: false }}
          />
          <StatCard 
            title="Uncovered Shifts"
            value="3"
            icon={<AlertTriangle size={20} />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ScheduleCard />
          <LeaveRequestsCard />
          <SchedulesNeedingApproval />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
