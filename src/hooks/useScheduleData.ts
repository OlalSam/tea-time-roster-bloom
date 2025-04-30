
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { ScheduleShift, ShiftType } from '@/types/database';

export function useScheduleData() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<(ScheduleShift & { shift_types: ShiftType })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScheduleData() {
      if (!user?.id) return;

      try {
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const { data, error: shiftsError } = await supabase
          .from('schedule_shifts')
          .select(`
            *,
            shift_types(*)
          `)
          .eq('employee_id', user.id)
          .gte('shift_date', startOfWeek.toISOString())
          .order('shift_date', { ascending: true });

        if (shiftsError) throw shiftsError;
        setShifts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch schedule data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchScheduleData();
  }, [user?.id]);

  return { shifts, isLoading, error };
}
