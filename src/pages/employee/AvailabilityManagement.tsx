
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAvailabilityData } from '@/hooks/useAvailabilityData';
import AvailabilityForm from '@/components/employee/AvailabilityForm';

const AvailabilityManagement = () => {
  const { user } = useAuth();
  const { availability, isLoading, error } = useAvailabilityData();

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest"></div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Availability Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Set Your Weekly Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailabilityForm currentAvailability={availability} />
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default AvailabilityManagement;
