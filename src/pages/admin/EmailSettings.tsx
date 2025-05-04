import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function EmailSettings() {
  const [senderEmail, setSenderEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEmailConfig();
  }, []);

  const loadEmailConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('email_config')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) {
        setSenderEmail(data.sender_email);
        setAppPassword(data.app_password);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load email settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('email_config')
        .upsert({ 
          id: 1, 
          sender_email: senderEmail,
          app_password: appPassword,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast({ title: 'Success', description: 'Email settings updated successfully' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update email settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gmail Address</label>
            <Input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="your-email@gmail.com"
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter the Gmail address that will be used to send notifications
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">App Password</label>
            <Input
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="Your Gmail App Password"
              required
            />
            <p className="text-sm text-muted-foreground">
              Use an App Password from your Google Account settings
            </p>
          </div>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
