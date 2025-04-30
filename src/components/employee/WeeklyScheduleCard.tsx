
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface ScheduleDay {
  date: string;
  day: string;
  shift: 'morning' | 'afternoon' | 'night' | 'off';
  time: string;
}

const WeeklyScheduleCard: React.FC = () => {
  const weekSchedule: ScheduleDay[] = [
    {
      date: '30',
      day: 'Wed',
      shift: 'morning',
      time: '6:00 AM - 2:00 PM',
    },
    {
      date: '01',
      day: 'Thu',
      shift: 'morning',
      time: '6:00 AM - 2:00 PM',
    },
    {
      date: '02',
      day: 'Fri',
      shift: 'afternoon',
      time: '2:00 PM - 10:00 PM',
    },
    {
      date: '03',
      day: 'Sat',
      shift: 'off',
      time: 'Day Off',
    },
    {
      date: '04',
      day: 'Sun',
      shift: 'off',
      time: 'Day Off',
    },
    {
      date: '05',
      day: 'Mon',
      shift: 'night',
      time: '10:00 PM - 6:00 AM',
    },
    {
      date: '06',
      day: 'Tue',
      shift: 'night',
      time: '10:00 PM - 6:00 AM',
    },
  ];

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning':
        return 'bg-amber-500';
      case 'afternoon':
        return 'bg-blue-500';
      case 'night':
        return 'bg-indigo-800';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <Card className="tea-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-lg font-medium">Weekly Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Apr 30 - May 06</span>
          <Button variant="outline" size="icon" className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-7 gap-2">
          {weekSchedule.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 rounded-lg border ${day.date === '30' ? 'border-forest' : 'border-border'} text-center`}
            >
              <div className="font-medium text-sm">{day.day}</div>
              <div className="text-xs text-muted-foreground mb-1">{day.date}</div>
              <div 
                className={`w-3 h-3 rounded-full ${getShiftColor(day.shift)} mx-auto mb-1`}
              ></div>
              <div className="text-xs truncate">
                {day.shift !== 'off' ? (
                  <Badge 
                    variant="secondary" 
                    className="font-normal text-[10px] truncate px-1"
                  >
                    {day.time}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Off</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyScheduleCard;
