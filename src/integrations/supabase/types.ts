export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clock_records: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string
          employee_id: string
          id: string
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          clock_in: string
          clock_out?: string | null
          created_at?: string
          employee_id: string
          id?: string
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clock_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_config: {
        Row: {
          app_password: string
          created_at: string | null
          id: number
          sender_email: string
          updated_at: string | null
        }
        Insert: {
          app_password: string
          created_at?: string | null
          id: number
          sender_email: string
          updated_at?: string | null
        }
        Update: {
          app_password?: string
          created_at?: string | null
          id?: number
          sender_email?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employee_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          employee_id: string
          id: string
          preference: string
          shift_type_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          employee_id: string
          id?: string
          preference: string
          shift_type_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          employee_id?: string
          id?: string
          preference?: string
          shift_type_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_availability_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_availability_shift_type_id_fkey"
            columns: ["shift_type_id"]
            isOneToOne: false
            referencedRelation: "shift_types"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          department_id: string | null
          first_name: string
          id: string
          last_name: string
          position: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          first_name: string
          id?: string
          last_name: string
          position: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          position?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string
          employee_id: string
          end_date: string
          id: string
          reason: string | null
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_shifts: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          schedule_id: string | null
          shift_date: string
          shift_type_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          schedule_id?: string | null
          shift_date: string
          shift_type_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          schedule_id?: string | null
          shift_date?: string
          shift_type_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_shifts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_shifts_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_shifts_shift_type_id_fkey"
            columns: ["shift_type_id"]
            isOneToOne: false
            referencedRelation: "shift_types"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          department_id: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_types: {
        Row: {
          color: string
          created_at: string | null
          end_time: string
          id: string
          name: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          end_time: string
          id?: string
          name: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          end_time?: string
          id?: string
          name?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
