
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlarmCheck, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

const ClockInOutCard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  
  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update elapsed time if clocked in
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isClockedIn) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isClockedIn]);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleClockToggle = () => {
    if (isClockedIn) {
      // Clock out logic
      setIsClockedIn(false);
      setElapsedTime(0);
    } else {
      // Clock in logic
      setIsClockedIn(true);
    }
  };

  return (
    <Card className={cn(
      "tea-shadow-md transition-all duration-200",
      isClockedIn ? "border-forest" : ""
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Clock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          {isClockedIn && (
            <div className="bg-forest/10 py-3 px-4 rounded-lg mb-4">
              <div className="flex items-center justify-center gap-2 text-forest mb-1">
                <Timer className="h-4 w-4" />
                <span className="font-medium">Elapsed Time</span>
              </div>
              <div className="text-2xl font-mono font-bold">
                {formatElapsedTime(elapsedTime)}
              </div>
            </div>
          )}
          
          <Button 
            className={cn(
              "w-full text-white",
              isClockedIn 
                ? "bg-destructive hover:bg-destructive/90" 
                : "bg-forest hover:bg-forest-dark"
            )}
            onClick={handleClockToggle}
          >
            {isClockedIn ? (
              <>
                <AlarmCheck className="h-4 w-4 mr-2" />
                Clock Out
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Clock In
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClockInOutCard;
