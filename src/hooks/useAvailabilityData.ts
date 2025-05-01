
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { EmployeeAvailability } from '@/types/database';

export function useAvailabilityData() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<EmployeeAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      if (!user?.id) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('employee_availability')
          .select('*')
          .eq('employee_id', user.id);

        if (fetchError) throw fetchError;
        // Cast the data to match our type definitions
        setAvailability((data || []) as EmployeeAvailability[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch availability');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailability();
  }, [user?.id]);

  return { availability, isLoading, error };
}
