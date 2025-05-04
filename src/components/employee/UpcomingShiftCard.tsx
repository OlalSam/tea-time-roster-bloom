import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { format, isToday as isTodayDate, isTomorrow, parseISO } from 'date-fns';
import { ScheduleShift } from '@/types/database';

interface UpcomingShiftCardProps {
  isToday?: boolean;
  shifts?: ScheduleShift[];
}

const UpcomingShiftCard: React.FC<UpcomingShiftCardProps> = ({ isToday = false, shifts = [] }) => {
  const today = new Date();
  
  // Find the relevant shift
  const relevantShift = shifts.find(shift => {
    const shiftDate = parseISO(shift.shift_date);
    return isToday ? isTodayDate(shiftDate) : isTomorrow(shiftDate);
  });

  if (!relevantShift) {
    return (
      <Card className="tea-shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            {isToday ? "Today's Shift" : "Next Shift"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            No shift scheduled
          </div>
        </CardContent>
      </Card>
    );
  }

  const shiftType = relevantShift.shift_types;
  const shiftDate = parseISO(relevantShift.shift_date);

  return (
    <Card className="tea-shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            {isToday ? "Today's Shift" : "Next Shift"}
          </CardTitle>
          {shiftType && (
            <Badge 
              style={{ 
                backgroundColor: `${shiftType.color}20`,
                color: shiftType.color,
                borderColor: shiftType.color
              }}
            >
              {shiftType.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(shiftDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          {shiftType && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{shiftType.start_time} - {shiftType.end_time}</span>
          </div>
          )}
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{relevantShift.employees?.departments?.name || 'Department'} Department</span>
          </div>
          
          {isToday && (
            <Button className="w-full mt-4 bg-forest hover:bg-forest-dark text-cream">
              Clock In
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingShiftCard;
