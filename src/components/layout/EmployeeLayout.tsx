
import React from 'react';
import EmployeeHeader from './EmployeeHeader';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EmployeeHeader />
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout;
