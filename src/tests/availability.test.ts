
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { updateAvailability, getAvailability } from '@/services/availabilityService';

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
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      upsert: vi.fn().mockResolvedValue(mockResponse)
    }));

    const result = await updateAvailability(mockAvailability);
    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockAvailability);
  });

  it('should retrieve employee availability', async () => {
    const mockEmployeeId = '123';
    const mockAvailabilityData = [
      { day_of_week: 1, start_time: '09:00', end_time: '17:00' }
    ];

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: mockAvailabilityData, error: null })
    }));

    const availability = await getAvailability(mockEmployeeId);
    expect(availability).toHaveLength(1);
    expect(availability[0]).toHaveProperty('day_of_week', 1);
  });
});
