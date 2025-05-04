import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin Routes
import AdminDashboard from "./pages/admin/AdminDashboard";
import ScheduleGenerator from "./pages/admin/ScheduleGenerator";
import Schedules from "./pages/admin/Schedules";
import ScheduleDetail from "./pages/admin/ScheduleDetail";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import LeaveManagement from "./pages/admin/LeaveManagement";
import AdminProfile from "./pages/admin/AdminProfile";
import EditEmployee from '@/pages/admin/EditEmployee';

// Employee Routes
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ClockInOut from "./pages/employee/ClockInOut";
import { default as EmployeeLeaveManagement } from "./pages/employee/LeaveManagement";
import AvailabilityManagement from "./pages/employee/AvailabilityManagement";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeSettings from "./pages/employee/EmployeeSettings";

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
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/schedule" element={
              <AdminRoute>
                <Schedules />
              </AdminRoute>
            } />
            <Route path="/admin/generate" element={
              <AdminRoute>
                <ScheduleGenerator />
              </AdminRoute>
            } />
            <Route path="/admin/approvals" element={
              <AdminRoute>
                <Schedules />
              </AdminRoute>
            } />
            <Route path="/admin/leave" element={
              <AdminRoute>
                <LeaveManagement />
              </AdminRoute>
            } />
            <Route path="/admin/employees" element={
              <AdminRoute>
                <EmployeeManagement />
              </AdminRoute>
            } />
            <Route path="/admin/reports" element={
              <AdminRoute>
                <Reports />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <Settings />
              </AdminRoute>
            } />
            <Route path="/admin/profile" element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            } />
            <Route path="/admin/schedules/:id" element={
              <AdminRoute>
                <ScheduleDetail />
              </AdminRoute>
            } />
            <Route path="/admin/employees/:id/edit" element={
              <AdminRoute>
                <EditEmployee />
              </AdminRoute>
            } />

            {/* Employee Routes */}
            <Route path="/employee" element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employee/clock" element={
              <ProtectedRoute>
                <ClockInOut />
              </ProtectedRoute>
            } />
            <Route path="/employee/leave" element={
              <ProtectedRoute>
                <EmployeeLeaveManagement />
              </ProtectedRoute>
            } />
            <Route path="/employee/availability" element={
              <ProtectedRoute>
                <AvailabilityManagement />
              </ProtectedRoute>
            } />
            <Route path="/employee/profile" element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            } />
            <Route path="/employee/settings" element={
              <ProtectedRoute>
                <EmployeeSettings />
              </ProtectedRoute>
            } />

            {/* Redirects for convenience */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/employee/dashboard" element={<Navigate to="/employee" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
