
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
  created_at: string;
  updated_at: string;
}

export interface ShiftType {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  color: string;
  created_at: string;
  updated_at: string;
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
}
