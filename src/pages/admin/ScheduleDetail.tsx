
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchScheduleById, fetchScheduleShifts, updateScheduleStatus } from '@/services/scheduleService';
import { fetchEmployees } from '@/services/employeeService';
import { fetchShiftTypes } from '@/services/shiftService';
import { Schedule, ScheduleShift, Employee, ShiftType } from '@/types/database';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

const ScheduleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [shifts, setShifts] = useState<ScheduleShift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [scheduleData, shiftsData, employeesData, shiftTypesData] = await Promise.all([
          fetchScheduleById(id),
          fetchScheduleShifts(id),
          fetchEmployees(),
          fetchShiftTypes()
        ]);
        
        setSchedule(scheduleData);
        setShifts(shiftsData);
        setEmployees(employeesData);
        setShiftTypes(shiftTypesData);
      } catch (error) {
        console.error('Failed to load schedule data:', error);
        toast({
          title: 'Error loading schedule',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, toast]);
  
  const handleApprove = async () => {
    if (!schedule) return;
    
    setIsUpdating(true);
    try {
      await updateScheduleStatus(schedule.id, 'approved');
      setSchedule({ ...schedule, status: 'approved' });
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
      setIsUpdating(false);
    }
  };
  
  const handleReject = async () => {
    if (!schedule) return;
    
    setIsUpdating(true);
    try {
      await updateScheduleStatus(schedule.id, 'rejected');
      setSchedule({ ...schedule, status: 'rejected' });
      toast({
        title: 'Schedule rejected',
        description: 'The schedule has been rejected.',
      });
    } catch (error) {
      console.error('Failed to reject schedule:', error);
      toast({
        title: 'Error rejecting schedule',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }
  
  if (!schedule) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <h3 className="text-lg font-medium">Schedule not found</h3>
          <p className="text-muted-foreground mt-2">
            The requested schedule could not be found.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/admin/schedules">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schedules
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  // Group shifts by date
  const shiftsByDate: Record<string, ScheduleShift[]> = {};
  shifts.forEach(shift => {
    if (!shiftsByDate[shift.shift_date]) {
      shiftsByDate[shift.shift_date] = [];
    }
    shiftsByDate[shift.shift_date].push(shift);
  });
  
  // Generate array of dates from start_date to end_date
  const dates: Date[] = [];
  const startDate = new Date(schedule.start_date);
  const endDate = new Date(schedule.end_date);
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  // Helper function to get employee name by id
  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown';
  };
  
  // Helper function to get shift type color by id
  const getShiftTypeColor = (id: string) => {
    const shiftType = shiftTypes.find(s => s.id === id);
    return shiftType?.color || '#888888';
  };
  
  // Helper function to get shift type name by id
  const getShiftTypeName = (id: string) => {
    const shiftType = shiftTypes.find(s => s.id === id);
    return shiftType?.name || 'Unknown';
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link 
              to="/admin/schedules" 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Schedules
            </Link>
            <h1 className="text-2xl font-bold">{schedule.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {format(new Date(schedule.start_date), 'MMM d')} - {format(new Date(schedule.end_date), 'MMM d, yyyy')}
              </span>
              <Badge 
                variant={
                  schedule.status === 'approved' ? 'success' : 
                  schedule.status === 'rejected' ? 'destructive' : 
                  'outline'
                }
              >
                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          {schedule.status === 'pending' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleReject}
                disabled={isUpdating}
              >
                <XCircle className="mr-2 h-4 w-4" /> 
                Reject
              </Button>
              <Button 
                className="bg-forest hover:bg-forest-dark text-cream"
                onClick={handleApprove}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-6">
          <h2 className="text-xl font-medium">Daily Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dates.map((date) => (
              <Card key={date.toISOString()}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">
                    {format(date, 'EEEE, MMM d')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shiftTypes.map(shiftType => {
                      const shiftsForType = (shiftsByDate[format(date, 'yyyy-MM-dd')] || [])
                        .filter(s => s.shift_type_id === shiftType.id);
                      
                      if (shiftsForType.length === 0) return null;
                      
                      return (
                        <div key={shiftType.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: shiftType.color }}
                            />
                            <span className="font-medium">{shiftType.name} Shift</span>
                          </div>
                          <ul className="space-y-1 pl-5 text-sm">
                            {shiftsForType.map(shift => (
                              <li key={shift.id}>
                                {getEmployeeName(shift.employee_id)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    
                    {!shiftsByDate[format(date, 'yyyy-MM-dd')] && (
                      <div className="py-3 text-center text-muted-foreground">
                        No shifts scheduled
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ScheduleDetail;
