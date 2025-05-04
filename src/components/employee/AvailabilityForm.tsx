import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { updateEmployeeAvailability } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';
import { EmployeeAvailability } from '@/types/database';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const PREFERENCES = [
  { value: 'preferred', label: 'Preferred', description: 'I prefer to work on this day' },
  { value: 'available', label: 'Available', description: 'I can work on this day if needed' },
  { value: 'unavailable', label: 'Unavailable', description: 'I cannot work on this day' }
];

const AvailabilityForm = ({ currentAvailability }: { currentAvailability: EmployeeAvailability[] }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [availabilitySettings, setAvailabilitySettings] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentAvailability?.length > 0) {
      const settings: Record<number, string> = {};
      currentAvailability.forEach(a => {
        settings[a.day_of_week] = a.preference;
      });
      setAvailabilitySettings(settings);
    } else {
      // Default all days to available
      const defaultSettings: Record<number, string> = {};
      DAYS.forEach((_, index) => {
        defaultSettings[index] = 'available';
      });
      setAvailabilitySettings(defaultSettings);
    }
  }, [currentAvailability]);

  const handlePreferenceChange = (dayIndex: number, preference: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      [dayIndex]: preference
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User information not available. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    // Count unavailable days
    const unavailableDays = Object.values(availabilitySettings).filter(
      preference => preference === 'unavailable'
    ).length;

    if (unavailableDays > 2) {
      toast({
        title: "Error",
        description: "You can only select up to two days as unavailable per week.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert settings object to array of availability objects
      const availabilityUpdates = Object.entries(availabilitySettings).map(([dayOfWeek, preference]) => ({
        day_of_week: parseInt(dayOfWeek),
        preference: preference as 'preferred' | 'available' | 'unavailable',
        shift_type_id: null // Set to null since no specific shift type is selected
      }));

      await updateEmployeeAvailability(user.id, availabilityUpdates);
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
      console.error("Error updating availability:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {DAYS.map((day, index) => (
        <div key={day} className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{day}</h3>
          </div>
          <RadioGroup 
            value={availabilitySettings[index] || 'available'}
            onValueChange={(value) => handlePreferenceChange(index, value)}
            className="space-y-2"
          >
            {PREFERENCES.map(preference => (
              <div key={preference.value} className="flex items-center space-x-2">
                <RadioGroupItem value={preference.value} id={`${day}-${preference.value}`} />
                <Label 
                  htmlFor={`${day}-${preference.value}`}
                  className="flex flex-col cursor-pointer"
                >
                  <span>{preference.label}</span>
                  <span className="text-xs text-muted-foreground">{preference.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      
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
