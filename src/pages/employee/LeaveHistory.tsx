import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { fetchEmployeeLeaveRequests } from '@/services/leaveService';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import type { LeaveRequest } from '@/types/database';

const LeaveHistory: React.FC = () => {
  const navigate = useNavigate();
  const { employee } = useEmployeeData();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaveRequests = async () => {
      if (!employee) return;

      try {
        const requests = await fetchEmployeeLeaveRequests(employee.id);
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
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
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
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leave History</h1>
          <Button
            onClick={() => navigate('/employee/leave-request')}
            className="bg-forest hover:bg-forest-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {leaveRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground mb-4">No leave requests found</p>
              <Button
                onClick={() => navigate('/employee/leave-request')}
                variant="outline"
              >
                Submit your first request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave
                  </CardTitle>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                      <p>{new Date(request.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">End Date</p>
                      <p>{new Date(request.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {request.reason && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground">Reason</p>
                      <p className="text-sm mt-1">{request.reason}</p>
                    </div>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground">
                    Submitted on {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default LeaveHistory; 