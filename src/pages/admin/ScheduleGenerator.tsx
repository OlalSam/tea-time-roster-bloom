
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ScheduleGenerationForm from '@/components/forms/ScheduleGenerationForm';

const ScheduleGenerator: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Schedule Generation</h1>
        </div>
        
        <ScheduleGenerationForm />
      </div>
    </AdminLayout>
  );
};

export default ScheduleGenerator;
