import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';

interface ClockInOutRecord {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  created_at: string;
}

interface DailyHours {
  day: string;
  hours: number;
  target: number;
}

export const useClockInOut = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<DailyHours[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);

  useEffect(() => {
    const fetchClockInOutData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const today = new Date();
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);

        // Fetch clock in/out records for the current week
        const { data: records, error } = await supabase
          .from('clock_records')
          .select('*')
          .eq('employee_id', user.id)
          .gte('clock_in', weekStart.toISOString())
          .lte('clock_in', weekEnd.toISOString())
          .order('clock_in', { ascending: true });

        if (error) throw error;

        // Generate array of days for the week
        const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        // Calculate hours for each day
        const dailyHours = daysOfWeek.map(date => {
          const dayRecords = records?.filter(record => 
            format(parseISO(record.clock_in), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          ) || [];

          let totalHoursForDay = 0;
          dayRecords.forEach(record => {
            if (record.clock_out) {
              const clockIn = parseISO(record.clock_in);
              const clockOut = parseISO(record.clock_out);
              const hours = differenceInHours(clockOut, clockIn);
              const minutes = differenceInMinutes(clockOut, clockIn) % 60;
              totalHoursForDay += hours + (minutes / 60);
            }
          });

          // Set target hours (8 for weekdays, 0 for weekends)
          const targetHours = [0, 6].includes(date.getDay()) ? 0 : 8;

          return {
            day: format(date, 'EEE'),
            hours: Number(totalHoursForDay.toFixed(2)),
            target: targetHours
          };
        });

        setWeeklyData(dailyHours);

        // Calculate totals
        const total = dailyHours.reduce((sum, day) => sum + day.hours, 0);
        const target = dailyHours.reduce((sum, day) => sum + day.target, 0);
        const overtime = Math.max(0, total - target);
        const remaining = Math.max(0, target - total);

        setTotalHours(Number(total.toFixed(2)));
        setOvertimeHours(Number(overtime.toFixed(2)));
        setRemainingHours(Number(remaining.toFixed(2)));

      } catch (error) {
        console.error('Error fetching clock in/out data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClockInOutData();
  }, [user?.id]);

  return {
    isLoading,
    weeklyData,
    totalHours,
    overtimeHours,
    remainingHours
  };
}; 