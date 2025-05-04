import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    sender_email: '',
    app_password: ''
  });

  useEffect(() => {
    loadEmailConfig();
  }, []);

  const loadEmailConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('email_config')
        .select('*')
        .eq('id', 1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setEmailConfig({
          sender_email: data[0].sender_email || '',
          app_password: data[0].app_password || ''
        });
      } else {
        // Initialize with empty values if no config exists
        setEmailConfig({
          sender_email: '',
          app_password: ''
        });
      }
    } catch (err) {
      console.error('Error loading email config:', err);
      toast({
        title: 'Error',
        description: 'Failed to load email configuration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailConfig = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('email_config')
        .upsert({
          id: 1,
          sender_email: emailConfig.sender_email,
          app_password: emailConfig.app_password,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Email configuration saved successfully'
      });
    } catch (err) {
      console.error('Error saving email config:', err);
      toast({
        title: 'Error',
        description: 'Failed to save email configuration',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-forest" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sender-email">Sender Email</Label>
                <Input
                  id="sender-email"
                  type="email"
                  placeholder="Enter sender email address"
                  value={emailConfig.sender_email}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, sender_email: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  The email address that will be used to send notifications
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-password">App Password</Label>
                <Input
                  id="app-password"
                  type="password"
                  placeholder="Enter app password"
                  value={emailConfig.app_password}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, app_password: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  The app password for the sender email account
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSaveEmailConfig}
              disabled={saving}
              className="bg-forest text-cream"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Email Configuration'
              )}
            </Button>
          </CardContent>
        </Card>
        
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
