
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { createLeaveRequest, getLeaveBalance } from '@/services/leaveService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn(),
    select: vi.fn(),
    eq: vi.fn()
  }
}));

describe('Leave Request Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully submit a leave request', async () => {
    const mockLeaveData = {
      employee_id: '123',
      start_date: '2024-03-20',
      end_date: '2024-03-22',
      type: 'vacation',
      reason: 'Family vacation'
    };

    const mockResponse = { data: { id: 1 }, error: null };
    
    // Properly mock the supabase client
    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve(mockResponse)
        })
      })
    } as any);

    try {
      await createLeaveRequest(mockLeaveData);
      expect(supabase.from).toHaveBeenCalledWith('leave_requests');
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});

// Alias for test compatibility
export const submitLeaveRequest = createLeaveRequest;
