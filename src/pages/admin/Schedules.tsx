
import React, { useEffect, useState } from 'react';
import { fetchSchedules, updateScheduleStatus } from '@/services/scheduleService';
import { Schedule } from '@/types/database';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarCheck, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadSchedules = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSchedules();
        setSchedules(data);
      } catch (error) {
        console.error('Failed to load schedules:', error);
        toast({
          title: 'Error loading schedules',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSchedules();
  }, [toast]);
  
  const handleApprove = async (id: string) => {
    setIsUpdating(id);
    try {
      await updateScheduleStatus(id, 'approved');
      setSchedules(prevSchedules => 
        prevSchedules.map(schedule => 
          schedule.id === id 
            ? { ...schedule, status: 'approved' } 
            : schedule
        )
      );
      toast({
        title: 'Schedule approved',
        description: 'The schedule has been approved successfully.',
      });
    } catch (error) {
      console.error('Failed to approve schedule:', error);
      toast({
        title: 'Error approving schedule',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(null);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Schedules</h1>
          <Link to="/admin/generate">
            <Button className="bg-forest hover:bg-forest-dark text-cream">
              <CalendarCheck className="mr-2 h-4 w-4" /> 
              Generate New Schedule
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/10">
            <h3 className="text-lg font-medium">No schedules found</h3>
            <p className="text-muted-foreground mt-2">
              Generate a new schedule to get started.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell>
                      {format(new Date(schedule.start_date), 'MMM d')} - {format(new Date(schedule.end_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          schedule.status === 'approved' ? 'success' : 
                          schedule.status === 'rejected' ? 'destructive' : 
                          'outline'
                        }
                      >
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(schedule.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          asChild
                        >
                          <Link to={`/admin/schedules/${schedule.id}`}>
                            <Eye className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                        {schedule.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-forest hover:bg-forest-dark text-cream"
                            onClick={() => handleApprove(schedule.id)}
                            disabled={isUpdating === schedule.id}
                          >
                            {isUpdating === schedule.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : 'Approve'}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SchedulesPage;
