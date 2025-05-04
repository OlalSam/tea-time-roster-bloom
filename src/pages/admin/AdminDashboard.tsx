import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import ScheduleCard from '@/components/admin/ScheduleCard';
import LeaveRequestsCard from '@/components/admin/LeaveRequestsCard';
import SchedulesNeedingApproval from '@/components/admin/SchedulesNeedingApproval';
import { Users, Clock, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { fetchDashboardStats, type DashboardStats } from '@/services/dashboardService';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(loadDashboardStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-forest" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={loadDashboardStats}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Employees"
            value={stats?.totalEmployees.toString() || '0'}
            icon={<Users size={20} />}
            trend={stats?.employeeTrend}
          />
          <StatCard 
            title="Active Shifts Today"
            value={stats?.activeShiftsToday.toString() || '0'}
            icon={<Calendar size={20} />}
          />
          <StatCard 
            title="Pending Leave Requests"
            value={stats?.pendingLeaveRequests.toString() || '0'}
            icon={<Clock size={20} />}
          />
          <StatCard 
            title="Uncovered Shifts"
            value={stats?.uncoveredShifts.toString() || '0'}
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
