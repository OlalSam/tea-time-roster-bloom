
import { describe, it, expect, beforeEach } from 'vitest';
import { generateSchedule } from '@/services/scheduleService';

describe('Schedule Generation', () => {
  const mockParams = {
    department: 'production',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-07'),
    preferences: {
      balanceWeekends: true,
      considerEmployeeRequests: true,
      optimizeForEfficiency: true
    },
    shiftDistribution: {
      morningRatio: 40,
      afternoonRatio: 40,
      nightRatio: 20
    }
  };

  it('should generate a valid schedule', async () => {
    const schedule = await generateSchedule(mockParams);
    expect(schedule).toBeDefined();
    expect(schedule.id).toBeDefined();
    expect(schedule.start_date).toBeDefined();
    expect(schedule.end_date).toBeDefined();
  });

  it('should respect shift distribution ratios', async () => {
    const schedule = await generateSchedule(mockParams);
    const shifts = await fetchScheduleShifts(schedule.id);
    
    const morningShifts = shifts.filter(s => s.shift_type_id === 'morning').length;
    const afternoonShifts = shifts.filter(s => s.shift_type_id === 'afternoon').length;
    const nightShifts = shifts.filter(s => s.shift_type_id === 'night').length;
    
    const total = morningShifts + afternoonShifts + nightShifts;
    
    expect(morningShifts / total).toBeCloseTo(0.4, 1);
    expect(afternoonShifts / total).toBeCloseTo(0.4, 1);
    expect(nightShifts / total).toBeCloseTo(0.2, 1);
  });
});
