
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { fetchSchedules, updateScheduleStatus } from '@/services/scheduleService';
import { Schedule } from '@/types/database';
import { Calendar, CheckCircle, Clock, Loader2, Search, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import AdminLayout from '@/components/layout/AdminLayout';

const SchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules();
        setSchedules(data);
      } catch (error) {
        toast({
          title: 'Error loading schedules',
          description: 'Could not fetch schedule data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSchedules();
  }, [toast]);
  
  const handleViewSchedule = (scheduleId: string) => {
    navigate(`/admin/schedules/${scheduleId}`);
  };
  
  const handleStatusChange = async (scheduleId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateScheduleStatus(scheduleId, status);
      
      // Update local state
      setSchedules(prevSchedules =>
        prevSchedules.map(schedule =>
          schedule.id === scheduleId ? { ...schedule, status } : schedule
        )
      );
      
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
  
  const filteredSchedules = statusFilter === 'all'
    ? schedules
    : schedules.filter(schedule => schedule.status === statusFilter);
  
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
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Schedule Management</h1>
          <Button onClick={() => navigate('/admin/generate')} className="bg-forest hover:bg-forest-dark text-cream">
            Create New Schedule
          </Button>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Schedules</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search schedules..."
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading schedules...</span>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No schedules found</p>
                <p className="text-sm">
                  {statusFilter !== 'all' 
                    ? `There are no schedules with ${statusFilter} status`
                    : 'Create a new schedule to get started'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schedule Name</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.name}</TableCell>
                      <TableCell>
                        {format(parseISO(schedule.start_date), 'MMM d, yyyy')} - {format(parseISO(schedule.end_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell>{format(parseISO(schedule.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewSchedule(schedule.id)}>
                            View Details
                          </Button>
                          
                          {schedule.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100" onClick={() => handleStatusChange(schedule.id, 'approved')}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100" onClick={() => handleStatusChange(schedule.id, 'rejected')}>
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SchedulesPage;
