
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { fetchScheduleById, fetchScheduleShifts, updateScheduleStatus } from '@/services/scheduleService';
import { fetchDepartments } from '@/services/departmentService';
import { fetchShiftTypes } from '@/services/shiftService';
import { Schedule, ScheduleShift, ShiftType, Department } from '@/types/database';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle, Clipboard, Loader2, User, XCircle } from 'lucide-react';

const ScheduleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [shifts, setShifts] = useState<ScheduleShift[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        const [scheduleData, shiftsData, shiftTypesData, departmentsData] = await Promise.all([
          fetchScheduleById(id),
          fetchScheduleShifts(id),
          fetchShiftTypes(),
          fetchDepartments()
        ]);
        
        setSchedule(scheduleData);
        setShifts(shiftsData);
        setShiftTypes(shiftTypesData);
        setDepartments(departmentsData);
        
        // Mock employee data for now - would normally come from an API
        const mockEmployees: Record<string, any> = {};
        shiftsData.forEach(shift => {
          if (!mockEmployees[shift.employee_id]) {
            mockEmployees[shift.employee_id] = {
              id: shift.employee_id,
              name: `Employee ${shift.employee_id.slice(0, 4)}`,
              position: 'Worker',
              department: 'Tea Processing'
            };
          }
        });
        
        setEmployees(mockEmployees);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error loading schedule',
          description: 'Could not fetch schedule details. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, toast]);
  
  const handleStatusChange = async (status: 'pending' | 'approved' | 'rejected') => {
    if (!id) return;
    
    try {
      await updateScheduleStatus(id, status);
      
      // Update local state
      if (schedule) {
        setSchedule({
          ...schedule,
          status
        });
      }
      
      toast({
        title: 'Status updated',
        description: `Schedule status changed to ${status}.`,
        variant: status === 'approved' ? 'default' : (status === 'rejected' ? 'destructive' : 'default'),
      });
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: 'Failed to update schedule status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getShiftTypeById = (id: string) => {
    return shiftTypes.find(type => type.id === id);
  };
  
  const getDepartmentById = (id: string | null) => {
    if (!id) return 'All Departments';
    return departments.find(dept => dept.id === id)?.name || 'Unknown';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <Calendar className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading schedule details...</span>
        </div>
      </AdminLayout>
    );
  }
  
  if (!schedule) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-lg font-medium">Schedule not found</p>
          <Button onClick={() => navigate('/admin/schedules')} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schedules
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/admin/schedules')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{schedule.name}</h1>
          <div className="ml-4">{getStatusBadge(schedule.status)}</div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p>{getDepartmentById(schedule.department_id)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date Range</p>
                <p>{format(parseISO(schedule.start_date), 'MMM d, yyyy')} - {format(parseISO(schedule.end_date), 'MMM d, yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p>{format(parseISO(schedule.created_at), 'MMM d, yyyy')}</p>
              </div>
            </div>
            
            {schedule.status === 'pending' && (
              <div className="mt-6 flex gap-2 justify-end">
                <Button variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100" onClick={() => handleStatusChange('rejected')}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Schedule
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusChange('approved')}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Assigned Shifts</CardTitle>
            <Button variant="outline" size="sm">
              <Clipboard className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            {shifts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No shifts assigned</p>
                <p className="text-sm">This schedule doesn't have any shifts assigned yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Shift Type</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => {
                    const shiftType = getShiftTypeById(shift.shift_type_id);
                    return (
                      <TableRow key={shift.id}>
                        <TableCell>{format(parseISO(shift.shift_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="link" className="p-0 h-auto">
                                {employees[shift.employee_id]?.name || `Employee ${shift.employee_id.slice(0, 4)}`}
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="flex justify-between space-x-4">
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold">
                                    {employees[shift.employee_id]?.name || `Employee ${shift.employee_id.slice(0, 4)}`}
                                  </h4>
                                  <p className="text-sm">
                                    {employees[shift.employee_id]?.position || 'Worker'}
                                  </p>
                                  <div className="flex items-center pt-2">
                                    <User className="mr-2 h-4 w-4 opacity-70" />
                                    <span className="text-xs text-muted-foreground">
                                      {employees[shift.employee_id]?.department || 'Department unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: shiftType?.color || '#888' }}
                            />
                            {shiftType?.name || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {shiftType ? `${shiftType.start_time.substring(0, 5)} - ${shiftType.end_time.substring(0, 5)}` : 'Unknown'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ScheduleDetail;
