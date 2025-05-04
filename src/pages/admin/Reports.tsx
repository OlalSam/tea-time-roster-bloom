import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

interface AttendanceData {
  name: string;
  present: number;
  absent: number;
  late: number;
}

interface LeaveData {
  name: string;
  value: number;
}

interface ScheduleData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchAttendanceData(),
        fetchLeaveData(),
        fetchScheduleData()
      ]);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    
    const { data: clockRecords, error } = await supabase
      .from('clock_records')
      .select('*')
      .gte('clock_in', weekStart.toISOString())
      .lte('clock_in', weekEnd.toISOString());

    if (error) throw error;

    // Group by day and calculate attendance stats
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const attendanceStats = days.map(day => {
      const dayRecords = clockRecords?.filter(record => 
        format(parseISO(record.clock_in), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ) || [];

      const present = dayRecords.length;
      const late = dayRecords.filter(record => {
        const clockInTime = parseISO(record.clock_in);
        return clockInTime.getHours() >= 9; // Consider late after 9 AM
      }).length;

      return {
        name: format(day, 'EEE'),
        present,
        absent: 50 - present, // Assuming 50 total employees
        late
      };
    });

    setAttendanceData(attendanceStats);
  };

  const fetchLeaveData = async () => {
    const { data: leaveRequests, error } = await supabase
      .from('leave_requests')
      .select('type, status')
      .eq('status', 'approved');

    if (error) throw error;

    // Count leave types
    const leaveCounts = leaveRequests?.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {}) || {};

    const leaveStats = Object.entries(leaveCounts).map(([name, value]) => ({
      name,
      value
    }));

    setLeaveData(leaveStats);
  };

  const fetchScheduleData = async () => {
    const { data: scheduleShifts, error } = await supabase
      .from('schedule_shifts')
      .select(`
        *,
        shift_types (
          name
        )
      `);

    if (error) throw error;

    // Count shift types
    const shiftCounts = scheduleShifts?.reduce((acc: { [key: string]: number }, curr) => {
      const shiftName = curr.shift_types?.name || 'Unknown';
      acc[shiftName] = (acc[shiftName] || 0) + 1;
      return acc;
    }, {}) || {};

    const shiftStats = Object.entries(shiftCounts).map(([name, value]) => ({
      name,
      value
    }));

    setScheduleData(shiftStats);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-lg">Loading reports...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <Tabs defaultValue="attendance">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="present" fill="#4CAF50" name="Present" />
                      <Bar dataKey="absent" fill="#F44336" name="Absent" />
                      <Bar dataKey="late" fill="#FFC107" name="Late" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leave">
            <Card>
              <CardHeader>
                <CardTitle>Leave Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {leaveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Shift Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scheduleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scheduleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Reports;
