
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createLeaveRequest } from '@/services/leaveService';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface LeaveRequestFormData {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveRequestForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveRequestFormData>();
  const { toast } = useToast();
  const { user } = useAuth();

  const onSubmit = async (data: LeaveRequestFormData) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit a leave request',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createLeaveRequest({
        employee_id: user.id,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason
      });

      toast({
        title: 'Success',
        description: 'Leave request submitted successfully',
      });

      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit leave request',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Select {...register('type')} required>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="bereavement">Bereavement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                type="date"
                {...register('startDate')}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="date"
                {...register('endDate')}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              {...register('reason')}
              placeholder="Reason for leave"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-forest text-cream hover:bg-forest-dark">
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestForm;
