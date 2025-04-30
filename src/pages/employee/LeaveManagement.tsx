
import React from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';
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

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'pending' | 'approved' | 'declined';
  submittedOn: string;
}

const LeaveManagement: React.FC = () => {
  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      type: 'Vacation',
      startDate: 'Jun 10, 2025',
      endDate: 'Jun 15, 2025',
      duration: '5 days',
      status: 'approved',
      submittedOn: 'Apr 15, 2025',
    },
    {
      id: 2,
      type: 'Sick Leave',
      startDate: 'May 05, 2025',
      endDate: 'May 05, 2025',
      duration: '1 day',
      status: 'pending',
      submittedOn: 'Apr 28, 2025',
    },
    {
      id: 3,
      type: 'Personal',
      startDate: 'Mar 22, 2025',
      endDate: 'Mar 22, 2025',
      duration: '1 day',
      status: 'declined',
      submittedOn: 'Mar 15, 2025',
    },
    {
      id: 4,
      type: 'Bereavement',
      startDate: 'Feb 10, 2025',
      endDate: 'Feb 12, 2025',
      duration: '3 days',
      status: 'approved',
      submittedOn: 'Feb 08, 2025',
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-yellow-50';
      case 'approved':
        return 'bg-green-500 text-green-50';
      case 'declined':
        return 'bg-red-500 text-red-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };
  
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
                  <div className="flex gap-2">
                    <Badge variant="outline">Available: 15 days</Badge>
                    <Badge variant="outline">Used: 5 days</Badge>
                  </div>
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
                            <TableCell>{request.startDate}</TableCell>
                            <TableCell>{request.endDate}</TableCell>
                            <TableCell>{request.duration}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{request.submittedOn}</TableCell>
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
