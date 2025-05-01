
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { updateAvailability, getAvailability } from '@/services/availabilityService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    upsert: vi.fn(),
    select: vi.fn(),
    eq: vi.fn()
  }
}));

describe('Availability Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update employee availability', async () => {
    const mockAvailability = {
      employeeId: '123',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      preference: 'preferred'
    };

    const mockResponse = { data: mockAvailability, error: null };
    
    // Properly mock the supabase client
    vi.spyOn(supabase, 'from').mockReturnValue({
      upsert: () => Promise.resolve(mockResponse)
    } as any);

    const result = await updateAvailability(mockAvailability);
    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockAvailability);
  });

  it('should retrieve employee availability', async () => {
    const mockEmployeeId = '123';
    const mockAvailabilityData = [
      { 
        day_of_week: 1, 
        preference: 'preferred' as const,
        id: '1',
        employee_id: '123',
        shift_type_id: 'abc',
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      }
    ];

    // Properly mock the supabase client for this test case
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve({ data: mockAvailabilityData, error: null })
      })
    } as any);

    const availability = await getAvailability(mockEmployeeId);
    expect(availability).toHaveLength(1);
    expect(availability[0]).toHaveProperty('day_of_week', 1);
  });
});
