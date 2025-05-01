
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfWeek } from 'date-fns';

interface WeeklyScheduleCardProps {
  data?: any; // Add this prop but make it optional
}

const WeeklyScheduleCard: React.FC<WeeklyScheduleCardProps> = ({ data }) => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  
  // Generate dates for the week
  const weekDates = [...Array(7)].map((_, i) => addDays(weekStart, i));
  
  return (
    <Card className="tea-shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weekDates.map((date, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded hover:bg-accent/50 transition-colors"
            >
              <span className="font-medium">{format(date, 'EEEE')}</span>
              <div>
                {index % 2 === 0 ? (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    Morning 6AM - 2PM
                  </Badge>
                ) : index === 5 || index === 6 ? (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                    Off
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    Afternoon 2PM - 10PM
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyScheduleCard;
