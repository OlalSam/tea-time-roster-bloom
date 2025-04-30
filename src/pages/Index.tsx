
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, FileText, Settings, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream-light flex flex-col">
      {/* Header */}
      <header className="bg-forest text-cream p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7C7 5.34315 8.34315 4 10 4H14C15.6569 4 17 5.34315 17 7C17 8.65685 15.6569 10 14 10H10C8.34315 10 7 8.65685 7 7Z" fill="#1F3D2E"/>
                <path d="M7 17C7 15.3431 8.34315 14 10 14H14C15.6569 14 17 15.3431 17 17C17 18.6569 15.6569 20 14 20H10C8.34315 20 7 18.6569 7 17Z" fill="#1F3D2E"/>
                <path d="M4 12C4 10.3431 5.34315 9 7 9H17C18.6569 9 20 10.3431 20 12C20 13.6569 18.6569 15 17 15H7C5.34315 15 4 13.6569 4 12Z" fill="#1F3D2E"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Tea Factory Management</h1>
              <p className="text-cream-dark text-sm md:text-base">Schedule & Leave Management System</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-transparent border-cream text-cream hover:bg-forest-dark">
              Sign Up
            </Button>
            <Button className="bg-mint text-forest hover:bg-mint-dark">
              Log In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-forest mt-8 mb-4">
            Streamlined Scheduling for Tea Factories
          </h2>
          <p className="text-lg text-charcoal-light max-w-2xl mx-auto">
            Access your schedule, manage shifts, and request time off with our intuitive dashboard system.
          </p>
        </div>

        <Tabs defaultValue="admin" className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
              <TabsTrigger value="employee">Employee Dashboard</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="admin">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card className="tea-shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-forest" />
                  </div>
                  <CardTitle>Schedule Generation</CardTitle>
                  <CardDescription>
                    Create and manage employee schedules efficiently with our automated system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-charcoal">
                    <li>Auto-generate weekly/monthly schedules</li>
                    <li>Filter by department, role, date range</li>
                    <li>Balance weekends and consider preferences</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/admin/generate" className="w-full">
                    <Button className="w-full bg-forest text-cream hover:bg-forest-dark">
                      Explore Feature
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="tea-shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-forest" />
                  </div>
                  <CardTitle>Leave Management</CardTitle>
                  <CardDescription>
                    Manage and approve employee leave requests with ease
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-charcoal">
                    <li>Review all pending leave requests</li>
                    <li>Approve or decline with one click</li>
                    <li>Track leave balances and history</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/admin" className="w-full">
                    <Button className="w-full bg-forest text-cream hover:bg-forest-dark">
                      Explore Feature
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="tea-shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-2">
                    <Settings className="h-6 w-6 text-forest" />
                  </div>
                  <CardTitle>Admin Controls</CardTitle>
                  <CardDescription>
                    Powerful tools for factory supervisors and managers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-charcoal">
                    <li>Comprehensive dashboard overview</li>
                    <li>Employee management and reporting</li>
                    <li>Schedule template configuration</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/admin" className="w-full">
                    <Button className="w-full bg-forest text-cream hover:bg-forest-dark">
                      Go to Admin Dashboard
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/admin">
                <Button size="lg" className="bg-forest text-cream hover:bg-forest-dark">
                  Access Admin Dashboard
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="employee">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card className="tea-shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-forest" />
                  </div>
                  <CardTitle>My Schedule</CardTitle>
                  <CardDescription>
                    View your upcoming shifts and weekly schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-charcoal">
                    <li>See daily and weekly assignments</li>
                    <li>Get instant notifications for changes</li>
                    <li>View shift details and locations</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/employee" className="w-full">
                    <Button className="w-full bg-forest text-cream hover:bg-forest-dark">
                      View Schedule
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="tea-shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-forest" />
                  </div>
                  <CardTitle>Clock In/Out</CardTitle>
                  <CardDescription>
                    Easily track your work hours and shifts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-charcoal">
                    <li>One-click clock in and out</li>
                    <li>Track hours worked in real-time</li>
                    <li>View weekly and monthly hour summaries</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/employee/clock" className="w-full">
                    <Button className="w-full bg-forest text-cream hover:bg-forest-dark">
                      Clock In/Out
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="tea-shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-forest" />
                  </div>
                  <CardTitle>Leave Requests</CardTitle>
                  <CardDescription>
                    Submit and track your time-off requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-charcoal">
                    <li>Submit various types of leave requests</li>
                    <li>Check approval status in real-time</li>
                    <li>View leave history and balances</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/employee/leave" className="w-full">
                    <Button className="w-full bg-forest text-cream hover:bg-forest-dark">
                      Request Leave
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/employee">
                <Button size="lg" className="bg-forest text-cream hover:bg-forest-dark">
                  Access Employee Dashboard
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-forest text-cream p-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Tea Factory Management</h3>
              <p className="text-sm text-cream-dark">
                A comprehensive solution for tea factory scheduling and leave management.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-cream-dark">
                <li><a href="#" className="hover:text-mint">About</a></li>
                <li><a href="#" className="hover:text-mint">Features</a></li>
                <li><a href="#" className="hover:text-mint">Contact</a></li>
                <li><a href="#" className="hover:text-mint">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Access</h4>
              <div className="space-y-2">
                <Link to="/admin" className="block text-sm text-cream-dark hover:text-mint">
                  Admin Login
                </Link>
                <Link to="/employee" className="block text-sm text-cream-dark hover:text-mint">
                  Employee Login
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-forest-light mt-8 pt-4 text-center text-xs text-cream-dark">
            &copy; 2025 Tea Factory Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
