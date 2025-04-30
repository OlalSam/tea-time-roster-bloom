
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface LeaveRequest {
  id: number;
  employee: {
    name: string;
    avatar: string;
    initials: string;
  };
  type: string;
  status: 'pending' | 'approved' | 'declined';
  date: string;
}

const LeaveRequestsCard: React.FC = () => {
  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      employee: {
        name: 'Emma Thompson',
        avatar: '',
        initials: 'ET',
      },
      type: 'Sick Leave',
      status: 'pending',
      date: 'May 4, 2025',
    },
    {
      id: 2,
      employee: {
        name: 'Michael Chen',
        avatar: '',
        initials: 'MC',
      },
      type: 'Vacation',
      status: 'pending',
      date: 'May 10-15, 2025',
    },
    {
      id: 3,
      employee: {
        name: 'Sarah Johnson',
        avatar: '',
        initials: 'SJ',
      },
      type: 'Personal Leave',
      status: 'pending',
      date: 'May 7, 2025',
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
    <Card className="tea-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Pending Leave Requests</CardTitle>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={request.employee.avatar} alt={request.employee.name} />
                  <AvatarFallback className="bg-forest text-cream text-xs">
                    {request.employee.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{request.employee.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{request.type}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">{request.date}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-border">
            <Button className="w-full" variant="outline">
              View All Requests
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsCard;
