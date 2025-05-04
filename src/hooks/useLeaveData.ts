import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useLeaveData = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leave_requests')
          .select('*')
          .eq('employee_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLeaveRequests(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leave requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [user?.id]);

  return { leaveRequests, loading, error };
};
