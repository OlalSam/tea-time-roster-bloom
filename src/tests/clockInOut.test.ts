
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { clockIn, clockOut, getTimeEntries } from '@/services/clockService';

describe('Clock In/Out Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should record clock in time', async () => {
    const mockEmployeeId = '123';
    const mockTime = new Date('2024-03-19T09:00:00');
    vi.setSystemTime(mockTime);

    const mockResponse = { 
      data: { id: 1, employee_id: mockEmployeeId, clock_in: mockTime }, 
      error: null 
    };

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue(mockResponse)
    }));

    const result = await clockIn(mockEmployeeId);
    expect(result.error).toBeNull();
    expect(result.data.clock_in).toEqual(mockTime);
  });

  it('should calculate hours worked correctly', async () => {
    const mockEmployeeId = '123';
    const mockEntries = [
      { 
        clock_in: '2024-03-19T09:00:00',
        clock_out: '2024-03-19T17:00:00'
      }
    ];

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: mockEntries, error: null })
    }));

    const entries = await getTimeEntries(mockEmployeeId, '2024-03-19');
    const hoursWorked = entries.reduce((acc, entry) => {
      const duration = new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime();
      return acc + (duration / (1000 * 60 * 60));
    }, 0);

    expect(hoursWorked).toBe(8);
  });
});
