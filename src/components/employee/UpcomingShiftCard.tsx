
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MapPin } from 'lucide-react';

interface UpcomingShiftCardProps {
  isToday?: boolean;
  data?: any; // Add this prop but make it optional
}

const UpcomingShiftCard: React.FC<UpcomingShiftCardProps> = ({ isToday = false, data }) => {
  return (
    <Card className="tea-shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            {isToday ? "Today's Shift" : "Next Shift"}
          </CardTitle>
          <Badge className="bg-amber-500 text-white">Morning</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{isToday ? 'Today, April 30, 2025' : 'Tomorrow, May 1, 2025'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>6:00 AM - 2:00 PM</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Processing Department, Floor 2</span>
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
