import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User,
  Bell,
  Menu
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/services/authService';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
        active 
          ? "text-forest font-medium" 
          : "text-foreground/60 hover:text-foreground"
      )}
    >
      <div className={cn(
        "w-10 h-10 flex items-center justify-center rounded-full",
        active ? "bg-forest text-cream" : "bg-background"
      )}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Link>
  );
};

const MobileNavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
        active 
          ? "bg-forest text-cream" 
          : "text-foreground hover:bg-muted"
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
};

const EmployeeHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee, isLoading } = useEmployeeData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (isLoading) {
    return <div className="h-16 bg-white border-b border-border animate-pulse" />;
  }

  return (
    <header className="bg-white border-b border-border">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between py-2 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 7C7 5.34315 8.34315 4 10 4H14C15.6569 4 17 5.34315 17 7C17 8.65685 15.6569 10 14 10H10C8.34315 10 7 8.65685 7 7Z" fill="#1F3D2E"/>
              <path d="M7 17C7 15.3431 8.34315 14 10 14H14C15.6569 14 17 15.3431 17 17C17 18.6569 15.6569 20 14 20H10C8.34315 20 7 18.6569 7 17Z" fill="#1F3D2E"/>
              <path d="M4 12C4 10.3431 5.34315 9 7 9H17C18.6569 9 20 10.3431 20 12C20 13.6569 18.6569 15 17 15H7C5.34315 15 4 13.6569 4 12Z" fill="#1F3D2E"/>
            </svg>
          </div>
          <h1 className="font-bold text-lg">Timetable</h1>
        </div>

        <nav className="flex items-center space-x-2">
          <NavItem
            to="/employee"
            icon={<Calendar size={20} />}
            label="My Schedule"
            active={location.pathname === "/employee"}
          />
          <NavItem
            to="/employee/clock"
            icon={<Clock size={20} />}
            label="Clock In/Out"
            active={location.pathname === "/employee/clock"}
          />
          <NavItem
            to="/employee/leave"
            icon={<FileText size={20} />}
            label="Leave"
            active={location.pathname === "/employee/leave"}
          />
          <NavItem
            to="/employee/profile"
            icon={<User size={20} />}
            label="Profile"
            active={location.pathname === "/employee/profile"}
          />
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-1 rounded-full">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={employee?.profile_image} alt={employee?.first_name} />
                  <AvatarFallback className="bg-mint text-forest">
                    {getInitials(employee?.first_name || '', employee?.last_name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{`${employee?.first_name} ${employee?.last_name}`}</span>
                  <span className="text-xs text-muted-foreground">{employee?.position}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/employee/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/employee/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                await signOut();
                navigate('/login');
              }} className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 7C7 5.34315 8.34315 4 10 4H14C15.6569 4 17 5.34315 17 7C17 8.65685 15.6569 10 14 10H10C8.34315 10 7 8.65685 7 7Z" fill="#1F3D2E"/>
              <path d="M7 17C7 15.3431 8.34315 14 10 14H14C15.6569 14 17 15.3431 17 17C17 18.6569 15.6569 20 14 20H10C8.34315 20 7 18.6569 7 17Z" fill="#1F3D2E"/>
              <path d="M4 12C4 10.3431 5.34315 9 7 9H17C18.6569 9 20 10.3431 20 12C20 13.6569 18.6569 15 17 15H7C5.34315 15 4 13.6569 4 12Z" fill="#1F3D2E"/>
            </svg>
          </div>
          <h1 className="font-bold text-lg">Timetable</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 py-4 mb-2">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={employee?.profile_image} alt={employee?.first_name} />
                    <AvatarFallback className="bg-mint text-forest">
                      {getInitials(employee?.first_name || '', employee?.last_name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{`${employee?.first_name} ${employee?.last_name}`}</h3>
                    <p className="text-sm text-muted-foreground">{employee?.position}</p>
                  </div>
                </div>

                <nav className="space-y-1 mt-4">
                  <MobileNavItem
                    to="/employee"
                    icon={<Calendar size={20} />}
                    label="My Schedule"
                    active={location.pathname === "/employee"}
                  />
                  <MobileNavItem
                    to="/employee/clock"
                    icon={<Clock size={20} />}
                    label="Clock In/Out"
                    active={location.pathname === "/employee/clock"}
                  />
                  <MobileNavItem
                    to="/employee/leave"
                    icon={<FileText size={20} />}
                    label="Leave"
                    active={location.pathname === "/employee/leave"}
                  />
                  <MobileNavItem
                    to="/employee/profile"
                    icon={<User size={20} />}
                    label="Profile"
                    active={location.pathname === "/employee/profile"}
                  />
                </nav>

                <div className="mt-auto pt-4 border-t border-border">
                  <Button className="w-full" variant="destructive" onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}>
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around p-1">
        <NavItem
          to="/employee"
          icon={<Calendar size={18} />}
          label="Schedule"
          active={location.pathname === "/employee"}
        />
        <NavItem
          to="/employee/clock"
          icon={<Clock size={18} />}
          label="Clock"
          active={location.pathname === "/employee/clock"}
        />
        <NavItem
          to="/employee/leave"
          icon={<FileText size={18} />}
          label="Leave"
          active={location.pathname === "/employee/leave"}
        />
        <NavItem
          to="/employee/profile"
          icon={<User size={18} />}
          label="Profile"
          active={location.pathname === "/employee/profile"}
        />
      </div>
    </header>
  );
};

export default EmployeeHeader;