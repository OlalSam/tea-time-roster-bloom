
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { updateEmployeeAvailability } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const AvailabilityForm = ({ currentAvailability }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentAvailability) {
      const unavailableDays = currentAvailability
        .filter(a => a.preference === 'unavailable')
        .map(a => a.day_of_week);
      setSelectedDays(unavailableDays);
    }
  }, [currentAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length > 2) {
      toast({
        title: "Error",
        description: "You can only select up to two days off per week.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const availabilityUpdates = DAYS.map((_, index) => ({
        day_of_week: index,
        preference: selectedDays.includes(index) ? 'unavailable' : 'available'
      }));

      await updateEmployeeAvailability(user!.id, availabilityUpdates);
      toast({
        title: "Success",
        description: "Your availability has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : prev.length < 2 
          ? [...prev, dayIndex]
          : prev
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map((day, index) => (
          <Button
            key={day}
            type="button"
            variant={selectedDays.includes(index) ? "destructive" : "outline"}
            className="w-full"
            onClick={() => toggleDay(index)}
          >
            {day}
          </Button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-forest text-cream hover:bg-forest-dark"
        >
          {isSubmitting ? "Saving..." : "Save Availability"}
        </Button>
      </div>
    </form>
  );
};

export default AvailabilityForm;
