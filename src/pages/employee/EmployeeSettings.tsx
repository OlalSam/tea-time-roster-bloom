import React, { useState } from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, Mail, User } from 'lucide-react';
import { updateEmployee } from '@/services/employeeService';
import { updatePassword } from '@/services/authService';

const EmployeeSettings: React.FC = () => {
  const { employee, isLoading } = useEmployeeData();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveGeneralSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employee) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateEmployee(employee.id, {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
      });

      toast({
        title: "Settings saved",
        description: "Your general settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employee) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateEmployee(employee.id, {
        notification_email: formData.get('notification-email') as string,
        notification_preferences: {
          schedule_updates: formData.get('schedule-notifications') === 'on',
          leave_requests: formData.get('leave-notifications') === 'on',
          announcements: formData.get('announcement-notifications') === 'on',
        }
      });

      toast({
        title: "Notification preferences saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const currentPassword = formData.get('current-password') as string;
    const newPassword = formData.get('new-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }

    try {
      await updatePassword(newPassword);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <form onSubmit={handleSaveGeneralSettings}>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        defaultValue={employee?.first_name || ''} 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        defaultValue={employee?.last_name || ''} 
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      defaultValue={employee?.email || ''} 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input 
                      id="position" 
                      disabled
                      defaultValue={employee?.position || ''} 
                    />
                    <p className="text-xs text-muted-foreground">Position can only be changed by administrators.</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <form onSubmit={handleSaveNotifications}>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="schedule-notifications">Schedule Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when your schedule changes
                      </p>
                    </div>
                    <Switch 
                      id="schedule-notifications" 
                      name="schedule-notifications"
                      defaultChecked={employee?.notification_preferences?.schedule_updates} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="leave-notifications">Leave Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about leave request status changes
                      </p>
                    </div>
                    <Switch 
                      id="leave-notifications" 
                      name="leave-notifications"
                      defaultChecked={employee?.notification_preferences?.leave_requests} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="announcement-notifications">Announcements</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive company-wide announcements
                      </p>
                    </div>
                    <Switch 
                      id="announcement-notifications" 
                      name="announcement-notifications"
                      defaultChecked={employee?.notification_preferences?.announcements} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <div className="flex gap-2 items-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="notification-email" 
                        name="notification-email"
                        type="email" 
                        defaultValue={employee?.notification_email || employee?.email || ''} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <form onSubmit={handleSavePassword}>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" name="current-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" name="new-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" name="confirm-password" type="password" required />
                  </div>
                  <div className="space-y-1 pt-2">
                    <Label>Password Requirements</Label>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      <li>Minimum 8 characters</li>
                      <li>At least one uppercase letter</li>
                      <li>At least one number or special character</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSettings;
