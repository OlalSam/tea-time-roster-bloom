export interface Department {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  department_id: string | null;
  position: string;
  leave_balance?: number;
  created_at: string;
  updated_at: string;
  departments?: Department;
  role?: string;
  profile_image?: string;
  email?: string;
  notification_email?: string;
  notification_preferences?: {
    schedule_updates: boolean;
    leave_requests: boolean;
    announcements: boolean;
  };
}

export interface ShiftType {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface Schedule {
  id: string;
  name: string;
  department_id: string | null;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ScheduleShift {
  id: string;
  schedule_id: string;
  employee_id: string;
  shift_type_id: string;
  shift_date: string;
  created_at: string;
  updated_at: string;
  shift_types?: ShiftType;
  employees?: {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
    departments?: {
      id: string;
      name: string;
    };
  };
}

export interface EmployeeAvailability {
  id: string;
  employee_id: string;
  day_of_week: number;
  preference: 'preferred' | 'available' | 'unavailable';
  shift_type_id: string | null;
  created_at: string;
  updated_at: string;
}

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  type: string;
  start_date: string;
  end_date: string;
  status: LeaveRequestStatus;
  reason?: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
    department?: {
      name: string;
    };
  };
}
