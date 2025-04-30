
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeaveRequest {
  id: number;
  type: string;
  status: 'pending' | 'approved' | 'declined';
  date: string;
  days: number;
}

const LeaveRequestCard: React.FC = () => {
  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      type: 'Vacation',
      status: 'approved',
      date: 'Jun 10-15, 2025',
      days: 5,
    },
    {
      id: 2,
      type: 'Sick Leave',
      status: 'pending',
      date: 'May 05, 2025',
      days: 1,
    }
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
    <Card className="tea-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Leave Requests</CardTitle>
        <Button size="sm" className="bg-forest text-cream hover:bg-forest-dark">
          <PlusCircle className="h-4 w-4 mr-1" />
          Request Leave
        </Button>
      </CardHeader>
      <CardContent>
        {leaveRequests.length > 0 ? (
          <div className="space-y-3">
            {leaveRequests.map((request) => (
              <div 
                key={request.id} 
                className="p-3 rounded-lg border border-border bg-background"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{request.type}</div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">{request.date}</div>
                  <div>{request.days} day{request.days > 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
            
            <div className="pt-4 mt-4 border-t border-border">
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                View All Requests
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
            <h3 className="font-medium mb-1">No leave requests</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have any leave requests yet
            </p>
            <Button className="bg-forest text-cream hover:bg-forest-dark">
              <PlusCircle className="h-4 w-4 mr-1" />
              Request Leave
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestCard;
