import React, { useEffect, useState } from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Plus } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { fetchLeaveRequests, LeaveRequest } from '@/services/leaveService';
import { useToast } from '@/components/ui/use-toast';
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';

const LeaveManagement: React.FC = () => {
  const { employee } = useEmployeeData();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaveRequests = async () => {
      if (!employee) return;

      try {
        const requests = await fetchLeaveRequests(employee.id);
        setLeaveRequests(requests);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load leave requests. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaveRequests();
  }, [employee, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-yellow-50';
      case 'approved':
        return 'bg-green-500 text-green-50';
      case 'rejected':
        return 'bg-red-500 text-red-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Leave Management</h1>
        
        <Tabs defaultValue="requests">
          <TabsList className="mb-6">
            <TabsTrigger value="requests" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              My Requests
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Request
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
            <Card className="tea-shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Leave Request History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {leaveRequests.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaveRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.type}</TableCell>
                            <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                            <TableCell>{calculateDuration(request.start_date, request.end_date)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
                    <h3 className="font-medium mb-1">No leave requests</h3>
                    <p className="text-sm text-muted-foreground">
                      You haven't submitted any leave requests yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="new">
            <LeaveRequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
};

export default LeaveManagement;
