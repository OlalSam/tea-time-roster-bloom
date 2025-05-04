import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { Check, X, Search, Loader2 } from 'lucide-react';
import { LeaveRequest, LeaveRequestStatus } from '@/types/database';
import { fetchLeaveRequests, updateLeaveRequestStatus } from '@/services/leaveService';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = async () => {
    try {
      const data = await fetchLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error loading leave requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leave requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: LeaveRequestStatus) => {
    try {
      await updateLeaveRequestStatus(requestId, newStatus);
      
      setLeaveRequests(requests =>
        requests.map(request =>
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );

      toast({
        title: 'Success',
        description: `Leave request ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating leave request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update leave request',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: LeaveRequestStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      approved: 'bg-green-100 text-green-800 hover:bg-green-200',
      rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    return (
      <Badge className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRequests = leaveRequests
    .filter(request => 
      statusFilter === 'all' || request.status === statusFilter
    )
    .filter(request => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      const employeeName = `${request.employee?.first_name} ${request.employee?.last_name}`.toLowerCase();
      return (
        employeeName.includes(searchLower) ||
        request.type.toLowerCase().includes(searchLower) ||
        request.status.toLowerCase().includes(searchLower)
      );
    });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-forest" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg">No leave requests found</p>
                <p className="text-sm">
                  {searchQuery 
                    ? 'Try adjusting your search or filters'
                    : statusFilter !== 'all'
                      ? `No ${statusFilter} requests found`
                      : 'No leave requests have been submitted yet'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {request.employee?.first_name} {request.employee?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.employee?.position}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {format(parseISO(request.start_date), 'MMM d, yyyy')}
                        {request.start_date !== request.end_date && (
                          <> - {format(parseISO(request.end_date), 'MMM d, yyyy')}</>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {format(parseISO(request.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailsDialog(true);
                            }}
                          >
                            View Details
                          </Button>
                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-700 hover:bg-green-100"
                                onClick={() => handleStatusChange(request.id, 'approved')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 text-red-700 hover:bg-red-100"
                                onClick={() => handleStatusChange(request.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Review the details of the leave request below.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employee</p>
                  <p className="text-sm">
                    {selectedRequest.employee?.first_name} {selectedRequest.employee?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position</p>
                  <p className="text-sm">{selectedRequest.employee?.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leave Type</p>
                  <p className="text-sm">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm">
                    {format(parseISO(selectedRequest.start_date), 'MMMM d, yyyy')}
                    {selectedRequest.start_date !== selectedRequest.end_date && (
                      <> - {format(parseISO(selectedRequest.end_date), 'MMMM d, yyyy')}</>
                    )}
                  </p>
                </div>
                {selectedRequest.reason && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Reason</p>
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'approved');
                      setShowDetailsDialog(false);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'rejected');
                      setShowDetailsDialog(false);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default LeaveManagement; 