
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Schedule Generation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-schedule">Automatic Schedule Generation</Label>
              <Switch id="auto-schedule" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekend-balance">Balance Weekend Shifts</Label>
              <Switch id="weekend-balance" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="leave-notifications">Leave Request Notifications</Label>
              <Switch id="leave-notifications" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-forest text-cream">
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
