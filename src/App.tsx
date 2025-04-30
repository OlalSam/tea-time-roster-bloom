
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin Routes
import AdminDashboard from "./pages/admin/AdminDashboard";
import ScheduleGenerator from "./pages/admin/ScheduleGenerator";
import Schedules from "./pages/admin/Schedules";
import ScheduleDetail from "./pages/admin/ScheduleDetail";

// Employee Routes
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ClockInOut from "./pages/employee/ClockInOut";
import LeaveManagement from "./pages/employee/LeaveManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/generate" element={<ScheduleGenerator />} />
          <Route path="/admin/schedules" element={<Schedules />} />
          <Route path="/admin/schedules/:id" element={<ScheduleDetail />} />
          
          {/* Employee Routes */}
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/clock" element={<ClockInOut />} />
          <Route path="/employee/leave" element={<LeaveManagement />} />
          
          {/* Redirects for convenience */}
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/employee/dashboard" element={<Navigate to="/employee" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
