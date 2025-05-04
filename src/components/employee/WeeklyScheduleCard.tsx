import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ScheduleShift } from '@/types/database';

interface WeeklyScheduleCardProps {
  shifts?: ScheduleShift[];
}

const WeeklyScheduleCard: React.FC<WeeklyScheduleCardProps> = ({ shifts = [] }) => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  
  // Generate dates for the week
  const weekDates = [...Array(7)].map((_, i) => addDays(weekStart, i));
  
  const getShiftForDate = (date: Date) => {
    return shifts.find(shift => isSameDay(new Date(shift.shift_date), date));
  };

  const getShiftBadge = (shift: ScheduleShift | undefined) => {
    if (!shift) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
          Off
        </Badge>
      );
    }

    const shiftType = shift.shift_types;
    if (!shiftType) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
          Not Assigned
        </Badge>
      );
    }

    return (
      <Badge 
        variant="outline" 
        className="border-current"
        style={{ 
          backgroundColor: `${shiftType.color}20`,
          color: shiftType.color,
          borderColor: shiftType.color
        }}
      >
        {shiftType.name} ({shiftType.start_time} - {shiftType.end_time})
      </Badge>
    );
  };
  
  return (
    <Card className="tea-shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weekDates.map((date, index) => {
            const shift = getShiftForDate(date);
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{format(date, 'EEEE')}</span>
                {getShiftBadge(shift)}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyScheduleCard;
