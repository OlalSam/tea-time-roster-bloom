import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Loader2 } from 'lucide-react';
import { fetchTodayShiftCounts, type ShiftCount } from '@/services/scheduleService';
import { useToast } from '@/components/ui/use-toast';

const shiftColors: Record<string, string> = {
  'morning': 'bg-amber-500',
  'afternoon': 'bg-blue-500',
  'night': 'bg-indigo-800',
};

const ScheduleCard: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftCount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadShiftCounts();
    // Refresh every 5 minutes
    const interval = setInterval(loadShiftCounts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadShiftCounts = async () => {
    try {
      const data = await fetchTodayShiftCounts();
      setShifts(data);
    } catch (error) {
      console.error('Error loading shift counts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load today\'s schedule',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalEmployees = shifts.reduce((sum, shift) => sum + (shift.count || 0), 0);

  if (loading) {
    return (
      <Card className="tea-shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Today's Schedule</CardTitle>
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-forest" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tea-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Today's Schedule</CardTitle>
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No shifts scheduled for today</p>
            </div>
          ) : (
            shifts.map((shift) => (
              <div key={shift.shift_type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${shiftColors[shift.shift_type.toLowerCase()]}`} />
                  <span className="font-medium">
                    {shift.shift_type.charAt(0).toUpperCase() + shift.shift_type.slice(1)} Shift
                  </span>
                </div>
                <Badge variant="outline" className="font-medium">
                  {shift.count || 0} employees
                </Badge>
              </div>
            ))
          )}
          
          {shifts.length > 0 && (
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Employees Scheduled</span>
                <span className="font-bold">{totalEmployees}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
