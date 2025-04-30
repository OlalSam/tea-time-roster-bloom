import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Loader2, Settings, Wand2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { fetchDepartments } from '@/services/departmentService';
import { generateSchedule, GenerateScheduleParams } from '@/services/scheduleService';
import { Department } from '@/types/database';

const scheduleGenerationSchema = z.object({
  department: z.string({
    required_error: 'Please select a department',
  }),
  startDate: z.date({
    required_error: 'Please select a start date',
  }),
  endDate: z.date({
    required_error: 'Please select an end date',
  }),
  preferences: z.object({
    balanceWeekends: z.boolean().default(true),
    considerEmployeeRequests: z.boolean().default(true),
    optimizeForEfficiency: z.boolean().default(false),
  }),
  shiftDistribution: z.object({
    morningRatio: z.number().min(0).max(100),
    afternoonRatio: z.number().min(0).max(100),
    nightRatio: z.number().min(0).max(100),
  }),
});

const ScheduleGenerationForm: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof scheduleGenerationSchema>>({
    resolver: zodResolver(scheduleGenerationSchema),
    defaultValues: {
      department: '',
      preferences: {
        balanceWeekends: true,
        considerEmployeeRequests: true,
        optimizeForEfficiency: false,
      },
      shiftDistribution: {
        morningRatio: 40,
        afternoonRatio: 40,
        nightRatio: 20,
      },
    },
  });
  
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departments = await fetchDepartments();
        setDepartments(departments);
      } catch (error) {
        console.error('Failed to load departments:', error);
        toast({
          title: 'Error loading departments',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    loadDepartments();
  }, [toast]);
  
  const handleGenerate = async (data: z.infer<typeof scheduleGenerationSchema>) => {
    setIsGenerating(true);
    try {
      // Ensure we have all required fields before calling the API
      const params: GenerateScheduleParams = {
        department: data.department,
        startDate: data.startDate,
        endDate: data.endDate,
        preferences: data.preferences,
        shiftDistribution: data.shiftDistribution
      };
      
      await generateSchedule(params);
      toast({
        title: 'Schedule generated successfully',
        description: 'The schedule has been created and is pending approval.',
      });
      form.reset();
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: 'Failed to generate schedule',
        description: 'An error occurred while generating the schedule.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="tea-shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Generate New Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="auto">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="auto" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" /> Auto Generate
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Advanced Options
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues('startDate');
                                return date < (startDate || new Date());
                              }}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-3 border-t border-border pt-4">
                  <FormLabel>Generation Preferences</FormLabel>
                  
                  <FormField
                    control={form.control}
                    name="preferences.balanceWeekends"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Balance weekend shifts
                          </FormLabel>
                          <FormDescription>
                            Distribute weekend shifts fairly among employees
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferences.considerEmployeeRequests"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Consider employee requests
                          </FormLabel>
                          <FormDescription>
                            Take into account time-off and schedule preferences
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferences.optimizeForEfficiency"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Optimize for efficiency
                          </FormLabel>
                          <FormDescription>
                            Prioritize productivity over employee preferences
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-forest hover:bg-forest-dark text-cream"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Schedule
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="manual">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Repeat department, start date, end date from above */}
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate = form.getValues('startDate');
                                  return date < (startDate || new Date());
                                }}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 border-t border-border pt-4">
                  <FormLabel>Shift Distribution</FormLabel>
                  
                  <FormField
                    control={form.control}
                    name="shiftDistribution.morningRatio"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex justify-between">
                          <FormLabel>Morning Shift (6AM-2PM)</FormLabel>
                          <span>{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            defaultValue={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                            className="bg-amber-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shiftDistribution.afternoonRatio"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex justify-between">
                          <FormLabel>Afternoon Shift (2PM-10PM)</FormLabel>
                          <span>{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            defaultValue={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                            className="bg-blue-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shiftDistribution.nightRatio"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex justify-between">
                          <FormLabel>Night Shift (10PM-6AM)</FormLabel>
                          <span>{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            defaultValue={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                            className="bg-indigo-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="py-2 px-3 bg-muted rounded-md text-sm">
                    <p className="text-muted-foreground">
                      Note: Distribution should ideally sum to 100%. The system will automatically adjust if needed.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-forest hover:bg-forest-dark text-cream"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Schedule
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScheduleGenerationForm;
