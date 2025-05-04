import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Loader2 } from 'lucide-react';
import { fetchPendingSchedules, updateScheduleStatus, type PendingSchedule } from '@/services/scheduleService';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const SchedulesNeedingApproval: React.FC = () => {
  const [schedules, setSchedules] = useState<PendingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingSchedules();
    // Refresh every 5 minutes
    const interval = setInterval(loadPendingSchedules, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingSchedules = async () => {
    try {
      const data = await fetchPendingSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Error loading pending schedules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending schedules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (scheduleId: string) => {
    try {
      await updateScheduleStatus(scheduleId, 'approved');
      setSchedules(schedules => schedules.filter(s => s.id !== scheduleId));
      toast({
        title: 'Success',
        description: 'Schedule has been approved',
      });
    } catch (error) {
      console.error('Error approving schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve schedule',
        variant: 'destructive',
      });
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d, yyyy')}`;
  };

  if (loading) {
    return (
      <Card className="tea-shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Schedules Needing Approval</CardTitle>
          <CheckCircle className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-forest" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tea-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Schedules Needing Approval</CardTitle>
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No schedules pending approval</p>
            </div>
          ) : (
            schedules.map((schedule) => (
              <div key={schedule.id} className="p-3 rounded-lg border border-border bg-background">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{schedule.department?.name || 'All Department'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDateRange(schedule.start_date, schedule.end_date)}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {schedule.employee_count || 0} employees
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-forest hover:bg-forest-dark text-cream"
                    onClick={() => handleApprove(schedule.id)}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/admin/schedules/${schedule.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
          
          <div className="pt-4 mt-4 border-t border-border">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate('/admin/schedule')}
            >
              View All Pending Schedules
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulesNeedingApproval;
