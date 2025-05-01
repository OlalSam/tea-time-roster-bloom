
import React from 'react';
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

const EmployeeSettings: React.FC = () => {
  const { employee, isLoading } = useEmployeeData();
  const { toast } = useToast();

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated.",
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
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
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:max-w-md">
            <TabsTrigger value="general">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="security">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </div>
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
                        defaultValue={employee?.first_name || ''} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={employee?.last_name || ''} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={employee?.email || ''} 
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

                  <div className="space-y-2">
                    <Label htmlFor="language">Language Preference</Label>
                    <select 
                      id="language" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
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
                    <Switch id="schedule-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="leave-notifications">Leave Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about leave request status changes
                      </p>
                    </div>
                    <Switch id="leave-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="announcement-notifications">Announcements</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive company-wide announcements
                      </p>
                    </div>
                    <Switch id="announcement-notifications" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <div className="flex gap-2 items-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="notification-email" 
                        type="email" 
                        defaultValue={employee?.email || ''} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save Preferences</Button>
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
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
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
                  <Button type="submit">Update Password</Button>
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
