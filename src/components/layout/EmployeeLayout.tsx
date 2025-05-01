
import React from 'react';
import EmployeeHeader from './EmployeeHeader';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used
import { Calendar, Clock, FileText, User, Settings } from 'lucide-react'; // Assuming lucide-react is used


interface EmployeeLayoutProps {
  children: React.ReactNode;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EmployeeHeader />
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
        {children}
        <div className="mt-4"> {/*Added div for better link grouping*/}
          <Link to="/employee/leave" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
            <FileText className="h-5 w-5 mr-2" />
            Leave Management
          </Link>
          <Link to="/employee/availability" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
            <Clock className="h-5 w-5 mr-2" />
            Availability
          </Link>
          <Link to="/employee/profile" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
            <User className="h-5 w-5 mr-2" />
            Profile
          </Link>
          <Link to="/employee/settings" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Link>
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
