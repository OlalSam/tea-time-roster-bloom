
import React from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, MapPin, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const EmployeeProfile: React.FC = () => {
  const { employee, department, isLoading, error } = useEmployeeData();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
        </div>
      </EmployeeLayout>
    );
  }

  if (error || !employee) {
    return (
      <EmployeeLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-medium text-red-600">Error loading profile data</h2>
          <p className="text-gray-600 mt-2">{error || "Could not load employee profile"}</p>
        </div>
      </EmployeeLayout>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing will be available soon.",
    });
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Profile</h1>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleEditProfile}
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardContent className="flex flex-col items-center pt-6 pb-6">
              <Avatar className="h-32 w-32 mb-4 border-4 border-muted">
                <AvatarImage src={employee.profile_image || ""} alt={employee.first_name} />
                <AvatarFallback className="text-2xl bg-mint text-forest">
                  {getInitials(employee.first_name, employee.last_name)}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-semibold mb-1">
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="text-muted-foreground">{employee.position}</p>
              
              <Separator className="my-4 w-full" />
              
              {employee.email && (
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
              )}

              {department && (
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{department.name} Department</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="col-span-1 md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{department?.name || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <p className="font-medium">{employee.id.substring(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Leave Balance</p>
                    <p className="font-medium">{employee.leave_balance || 0} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No recent activity to display.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;
