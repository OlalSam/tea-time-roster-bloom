
import React, { useState } from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { useAvailabilityData } from '@/hooks/useAvailabilityData';
import AvailabilityForm from '@/components/employee/AvailabilityForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeAvailability } from '@/types/database';
import { Badge } from '@/components/ui/badge';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilityManagement: React.FC = () => {
  const { availability, isLoading, error } = useAvailabilityData();
  const [activeTab, setActiveTab] = useState<string>('view');

  const renderAvailabilityByDay = () => {
    return DAYS.map((day, index) => {
      const dayAvailability = availability.filter(a => a.day_of_week === index);
      const preference = dayAvailability[0]?.preference || 'unavailable';
      
      return (
        <div key={day} className="flex items-center justify-between py-3 border-b last:border-0">
          <span className="font-medium">{day}</span>
          <Badge
            className={
              preference === 'preferred' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              preference === 'available' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
              'bg-red-100 text-red-800 hover:bg-red-200'
            }
          >
            {preference.charAt(0).toUpperCase() + preference.slice(1)}
          </Badge>
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
        </div>
      </EmployeeLayout>
    );
  }

  if (error) {
    return (
      <EmployeeLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-medium text-red-600">Error loading availability data</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Availability</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Availability</CardTitle>
            <CardDescription>
              Set your weekly availability preferences to help with scheduling.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="view" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="view">View Availability</TabsTrigger>
                <TabsTrigger value="edit">Edit Availability</TabsTrigger>
              </TabsList>
              <TabsContent value="view" className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    {availability.length > 0 ? (
                      renderAvailabilityByDay()
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        No availability preferences set. Please use the Edit tab to set your availability.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="edit">
                <AvailabilityForm currentAvailability={availability as EmployeeAvailability[]} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>You can mark up to two days per week as unavailable.</li>
              <li>Days marked as "Preferred" will be prioritized when creating your schedule.</li>
              <li>Days marked as "Available" will be considered for scheduling, but with lower priority.</li>
              <li>Days marked as "Unavailable" will not be scheduled unless absolutely necessary.</li>
              <li>Please update your availability at least two weeks before the new schedule period.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default AvailabilityManagement;
