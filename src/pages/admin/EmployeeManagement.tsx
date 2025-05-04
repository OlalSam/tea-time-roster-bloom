import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEmployeesData } from '@/hooks/useEmployeesData';
import { deleteEmployee } from '@/services/employeeService';
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
  const { employees, isLoading, error } = useEmployeesData();
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployee(employeeToDelete);
      // Refresh the page or update the employees list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setEmployeeToDelete(null);
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
        <div className="text-red-500">Error: {error.message}</div>
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
                    >
                      Delete
                      </Button>
                  </div>
                </div>
          </CardContent>
        </Card>
          ))}
        </div>

        <AlertDialog open={!!employeeToDelete} onOpenChange={() => setEmployeeToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the employee.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default EmployeeManagement;
