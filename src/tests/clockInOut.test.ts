
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clockIn, clockOut } from '@/services/clockService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn() })) })),
      select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn() })) }))
    }))
  }
}));

// Use vi.beforeEach instead of afterEach
beforeEach(() => {
  vi.resetAllMocks();
});

describe('Clock Service', () => {
  it('should clock in a user successfully', async () => {
    const mockResponse = {
      data: { id: '123', employee_id: '456', clock_in: new Date().toISOString() },
      error: null
    };

    // Fix the spy implementation to return a properly mocked response
    const spy = vi.spyOn(supabase, 'from').mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve(mockResponse)
        })
      })
    } as any);

    const result = await clockIn('456');
    expect(result).toHaveProperty('data');
    expect(result).not.toHaveProperty('error');
    expect(spy).toHaveBeenCalledWith('clock_records');
  });

  it('should clock out a user successfully', async () => {
    const mockResponse = {
      data: { id: '123', clock_out: new Date().toISOString(), total_hours: 8 },
      error: null
    };

    // Fix the spy implementation to return a properly mocked response
    const spy = vi.spyOn(supabase, 'from').mockReturnValue({
      update: () => ({
        eq: () => ({
          single: () => Promise.resolve(mockResponse)
        })
      })
    } as any);

    const result = await clockOut('123');
    expect(result).toHaveProperty('data');
    expect(result).not.toHaveProperty('error');
    expect(spy).toHaveBeenCalledWith('clock_records');
  });
});
