
import React from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import ClockInOutCard from '@/components/employee/ClockInOutCard';
import UpcomingShiftCard from '@/components/employee/UpcomingShiftCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const ClockInOut: React.FC = () => {
  // Sample data for the hours worked chart
  const weeklyData = [
    { day: 'Mon', hours: 8, target: 8 },
    { day: 'Tue', hours: 8.5, target: 8 },
    { day: 'Wed', hours: 7.75, target: 8 },
    { day: 'Thu', hours: 0, target: 8 },
    { day: 'Fri', hours: 0, target: 8 },
    { day: 'Sat', hours: 0, target: 0 },
    { day: 'Sun', hours: 0, target: 0 },
  ];

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Clock In/Out</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClockInOutCard />
          <UpcomingShiftCard isToday={true} />
        </div>
        
        <Card className="tea-shadow-md mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Hours Worked</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week">
              <TabsList className="mb-4">
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
              <TabsContent value="week">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value} hours`, 
                          name === 'hours' ? 'Hours Worked' : 'Target Hours'
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="hours" name="Hours Worked" fill="#1F3D2E" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="Target Hours" fill="#A8D5BA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Hours this week</p>
                    <p className="font-medium text-lg">24.25 / 40</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overtime</p>
                    <p className="font-medium text-lg">0.5 hrs</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-medium text-lg">15.75 hrs</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="month">
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Monthly data will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default ClockInOut;
