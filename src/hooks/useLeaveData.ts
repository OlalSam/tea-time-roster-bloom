
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LeaveRequest, fetchEmployeeLeaveRequests } from '@/services/leaveService';

export function useLeaveData() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await fetchEmployeeLeaveRequests(user.id);
        // Cast the data to ensure it matches our LeaveRequest type
        setLeaveRequests(data as LeaveRequest[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leave requests');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  return { leaveRequests, loading, error };
}
