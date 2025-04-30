import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

// Auth Routes
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/generate" element={<AdminRoute><ScheduleGenerator /></AdminRoute>} />
          <Route path="/admin/schedules" element={<AdminRoute><Schedules /></AdminRoute>} />
          <Route path="/admin/schedules/:id" element={<AdminRoute><ScheduleDetail /></AdminRoute>} />

          {/* Employee Routes */}
          <Route path="/employee" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/clock" element={<ProtectedRoute><ClockInOut /></ProtectedRoute>} />
          <Route path="/employee/leave" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />

          {/* Redirects for convenience */}
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/employee/dashboard" element={<Navigate to="/employee" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;