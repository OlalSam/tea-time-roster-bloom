import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLeaveData } from '@/hooks/useLeaveData';
import { Skeleton } from '@/components/ui/skeleton';

const LeaveRequestCard: React.FC = () => {
  const { leaveRequests, loading, error } = useLeaveData();

  if (loading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (error) {
    return (
      <Card className="tea-shadow-md">
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const recentRequests = leaveRequests.slice(0, 3);

  return (
    <Card className="tea-shadow-md">
      <CardHeader>
        <CardTitle>Recent Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {recentRequests.length > 0 ? (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{request.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={
                    request.status === 'approved'
                      ? 'bg-green-500'
                      : request.status === 'declined'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No recent leave requests</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestCard;