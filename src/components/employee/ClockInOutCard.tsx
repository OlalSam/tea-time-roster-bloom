import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Clock } from 'lucide-react';
import { clockIn, clockOut, getActiveClockRecord } from '@/services/clockService';

import { useAuth } from '@/contexts/AuthContext';

const ClockInOutCard: React.FC = () => {
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    checkActiveRecord();
  }, []);

  const checkActiveRecord = async () => {
    try {
      if (!user?.id) return;
      const record = await getActiveClockRecord(user.id);
      setActiveRecord(record);
    } catch (error) {
      console.error('Error checking clock status:', error);
    }
  };

  const handleClockAction = async () => {
    try {
      setIsClockingIn(true);
      if (activeRecord) {
        await clockOut(activeRecord.id);
        setActiveRecord(null);
      } else {
        if (!user?.id) return;
        const record = await clockIn(user.id);
        setActiveRecord(record);
      }

      toast({
        title: 'Success',
        description: `Successfully clocked ${activeRecord ? 'out' : 'in'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to clock ${activeRecord ? 'out' : 'in'}`,
        variant: 'destructive',
      });
    } finally {
      setIsClockingIn(false);
    }
  };

  return (
    <Card className="tea-shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Clock In/Out</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-4xl font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <Button
            size="lg"
            onClick={handleClockAction}
            disabled={isClockingIn}
            className={`w-full ${
              activeRecord
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-forest hover:bg-forest-dark'
            } text-cream`}
          >
            <Clock className="mr-2 h-5 w-5" />
            {activeRecord ? 'Clock Out' : 'Clock In'}
          </Button>
          {activeRecord && (
            <p className="text-sm text-muted-foreground">
              Clocked in at: {new Date(activeRecord.clock_in).toLocaleTimeString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClockInOutCard;