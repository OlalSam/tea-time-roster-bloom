
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { submitLeaveRequest, getLeaveBalance } from '@/services/leaveService';

describe('Leave Request Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully submit a leave request', async () => {
    const mockLeaveData = {
      employeeId: '123',
      startDate: '2024-03-20',
      endDate: '2024-03-22',
      type: 'vacation',
      reason: 'Family vacation'
    };

    const mockResponse = { data: { id: 1 }, error: null };
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue(mockResponse)
    }));

    const result = await submitLeaveRequest(mockLeaveData);
    expect(result).toHaveProperty('id');
    expect(result.error).toBeNull();
  });

  it('should calculate leave balance correctly', async () => {
    const mockEmployeeId = '123';
    const mockLeaveData = {
      total_days: 20,
      used_days: 5
    };

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: mockLeaveData, error: null })
    }));

    const balance = await getLeaveBalance(mockEmployeeId);
    expect(balance).toBe(15);
  });
});
