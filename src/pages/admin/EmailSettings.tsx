
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function EmailSettings() {
  const [senderEmail, setSenderEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('email_config')
        .upsert({ 
          id: 1, 
          sender_email: senderEmail,  // Match the DB column name
          app_password: appPassword   // Match the DB column name
        });

      if (error) throw error;
      toast({ title: 'Success', description: 'Email settings updated successfully' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update email settings',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Gmail Address</label>
            <Input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="your-email@gmail.com"
            />
          </div>
          <div>
            <label>App Password</label>
            <Input
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="Your Gmail App Password"
            />
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
}
