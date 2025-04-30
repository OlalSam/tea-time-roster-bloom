
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar } from 'lucide-react';

interface ScheduleApproval {
  id: number;
  department: string;
  date: string;
  employees: number;
  status: 'pending' | 'approved' | 'declined';
}

const SchedulesNeedingApproval: React.FC = () => {
  const schedules: ScheduleApproval[] = [
    {
      id: 1,
      department: 'Processing',
      date: 'May 5-11, 2025',
      employees: 12,
      status: 'pending',
    },
    {
      id: 2,
      department: 'Packaging',
      date: 'May 5-11, 2025',
      employees: 8,
      status: 'pending',
    },
    {
      id: 3,
      department: 'Warehouse',
      date: 'May 5-11, 2025',
      employees: 6,
      status: 'pending',
    },
  ];

  return (
    <Card className="tea-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Schedules Needing Approval</CardTitle>
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-3 rounded-lg border border-border bg-background">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{schedule.department}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{schedule.date}</span>
                  </div>
                </div>
                <Badge variant="outline" className="font-medium">
                  {schedule.employees} employees
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1 bg-forest hover:bg-forest-dark text-cream">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View
                </Button>
              </div>
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-border">
            <Button className="w-full" variant="outline">
              View All Pending Schedules
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulesNeedingApproval;
