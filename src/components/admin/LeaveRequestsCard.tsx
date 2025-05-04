import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Loader2 } from 'lucide-react';
import { fetchPendingLeaveRequests } from '@/services/leaveService';
import { LeaveRequest } from '@/types/database';
import { format, parseISO } from 'date-fns';

const LeaveRequestsCard: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaveRequests();
    // Refresh every 5 minutes
    const interval = setInterval(loadLeaveRequests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaveRequests = async () => {
    try {
      const data = await fetchPendingLeaveRequests();
      setLeaveRequests(data.slice(0, 3)); // Show only the 3 most recent requests
    } catch (error) {
      console.error('Error loading leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500 text-yellow-50',
      approved: 'bg-green-500 text-green-50',
      rejected: 'bg-red-500 text-red-50',
    };

    return styles[status as keyof typeof styles] || 'bg-gray-500 text-gray-50';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Pending Leave Requests</CardTitle>
          <Clock className="h-5 w-5 text-muted-foreground" />
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
        <CardTitle className="text-lg font-medium">Pending Leave Requests</CardTitle>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaveRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending leave requests</p>
            </div>
          ) : (
            leaveRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-forest text-cream text-xs">
                      {`${request.employee?.first_name?.[0]}${request.employee?.last_name?.[0]}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium text-sm">
                      {request.employee?.first_name} {request.employee?.last_name}
                    </p>
                  <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={getStatusBadge(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                      <span className="text-xs text-muted-foreground">
                        {request.type} • {request.employee?.department?.name || 'All Departments'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">
                    {format(parseISO(request.start_date), 'MMM d, yyyy')}
                    {request.start_date !== request.end_date && (
                      <> - {format(parseISO(request.end_date), 'MMM d, yyyy')}</>
                    )}
                  </p>
              </div>
              </div>
            ))
          )}
          
          <div className="pt-4 mt-4 border-t border-border">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate('/admin/leave')}
            >
              View All Requests
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsCard;
