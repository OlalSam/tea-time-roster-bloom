import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEmployeesData } from '@/hooks/useEmployeesData';
import { deleteEmployee, EmployeeDeletionError } from '@/services/employeeService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { employees, isLoading, error, refetch } = useEmployeesData();
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteEmployee(employeeToDelete);
      
      setEmployeeToDelete(null);
      toast({
        title: "Success",
        description: "Employee has been deleted successfully.",
        variant: "default",
      });
      
      await refetch();
    } catch (error) {
      console.error('Error deleting employee:', error);
      
      if (error instanceof EmployeeDeletionError) {
        // Handle specific constraint errors
        let actionMessage = '';
        switch (error.constraint) {
          case 'schedule_shifts_employee_id_fkey':
            actionMessage = 'Please remove or reassign their scheduled shifts first.';
            break;
          case 'leave_requests_employee_id_fkey':
            actionMessage = 'Please handle their leave requests first.';
            break;
          case 'clock_records_employee_id_fkey':
            actionMessage = 'Please handle their clock records first.';
            break;
          default:
            actionMessage = 'Please handle their associated records first.';
        }

        toast({
          title: "Cannot Delete Employee",
          description: (
            <div className="space-y-2">
              <p>{error.message}</p>
              <p className="font-medium">{actionMessage}</p>
              <p className="text-sm text-muted-foreground">
                You can find these records in the respective management sections.
              </p>
            </div>
          ),
          variant: "destructive",
          duration: 10000, // Show for 10 seconds to give time to read
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to delete employee',
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest" />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-500">
          <p>Error: {error.message}</p>
          <Button 
            onClick={() => refetch()} 
            className="mt-4 bg-forest text-cream"
          >
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <Button onClick={() => navigate('/admin/employees/new')} className="bg-forest text-cream">
            Add Employee
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <CardTitle>{employee.first_name} {employee.last_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p><strong>Position:</strong> {employee.position}</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setEmployeeToDelete(employee.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting && employeeToDelete === employee.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AlertDialog 
          open={!!employeeToDelete} 
          onOpenChange={(open) => {
            if (!open && !isDeleting) {
              setEmployeeToDelete(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2">
                  <p>This action cannot be undone. This will permanently delete the employee.</p>
                  <p className="font-medium text-amber-600">
                    Note: If the employee has any associated records (schedules, leave requests, etc.),
                    you will need to handle those first before deletion is possible.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default EmployeeManagement;
