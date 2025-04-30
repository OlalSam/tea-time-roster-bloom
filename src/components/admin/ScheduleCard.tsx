
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';

interface ShiftType {
  id: number;
  name: string;
  color: string;
  count: number;
}

const ScheduleCard: React.FC = () => {
  const shiftTypes: ShiftType[] = [
    { id: 1, name: 'Morning', color: 'bg-amber-500', count: 15 },
    { id: 2, name: 'Afternoon', color: 'bg-blue-500', count: 12 },
    { id: 3, name: 'Night', color: 'bg-indigo-800', count: 8 },
  ];

  return (
    <Card className="tea-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Today's Schedule</CardTitle>
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shiftTypes.map((shift) => (
            <div key={shift.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${shift.color}`} />
                <span className="font-medium">{shift.name} Shift</span>
              </div>
              <Badge variant="outline" className="font-medium">
                {shift.count} employees
              </Badge>
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Employees Scheduled</span>
              <span className="font-bold">35</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
