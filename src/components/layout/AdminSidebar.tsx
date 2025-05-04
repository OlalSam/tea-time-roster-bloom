
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  CalendarDays, 
  Calendar, 
  ClipboardCheck, 
  Clock, 
  FileText, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Home,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  to, 
  active, 
  collapsed,
  onClick
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
      onClick={onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      {!collapsed && <span className="transition-opacity duration-200">{label}</span>}
    </Link>
  );
};

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div 
      className={cn(
        "flex flex-col min-h-screen bg-sidebar transition-all duration-200 border-r border-sidebar-border shadow-lg",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7C7 5.34315 8.34315 4 10 4H14C15.6569 4 17 5.34315 17 7C17 8.65685 15.6569 10 14 10H10C8.34315 10 7 8.65685 7 7Z" fill="#1F3D2E"/>
                <path d="M7 17C7 15.3431 8.34315 14 10 14H14C15.6569 14 17 15.3431 17 17C17 18.6569 15.6569 20 14 20H10C8.34315 20 7 18.6569 7 17Z" fill="#1F3D2E"/>
                <path d="M4 12C4 10.3431 5.34315 9 7 9H17C18.6569 9 20 10.3431 20 12C20 13.6569 18.6569 15 17 15H7C5.34315 15 4 13.6569 4 12Z" fill="#1F3D2E"/>
              </svg>
            </div>
            <h1 className="text-sidebar-foreground font-bold text-lg">Tea Factory</h1>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-full bg-mint flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 7C7 5.34315 8.34315 4 10 4H14C15.6569 4 17 5.34315 17 7C17 8.65685 15.6569 10 14 10H10C8.34315 10 7 8.65685 7 7Z" fill="#1F3D2E"/>
              <path d="M7 17C7 15.3431 8.34315 14 10 14H14C15.6569 14 17 15.3431 17 17C17 18.6569 15.6569 20 14 20H10C8.34315 20 7 18.6569 7 17Z" fill="#1F3D2E"/>
              <path d="M4 12C4 10.3431 5.34315 9 7 9H17C18.6569 9 20 10.3431 20 12C20 13.6569 18.6569 15 17 15H7C5.34315 15 4 13.6569 4 12Z" fill="#1F3D2E"/>
            </svg>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-2">
        <SidebarItem
          to="/admin"
          icon={<Home size={20} />}
          label="Dashboard"
          active={location.pathname === "/admin"}
          collapsed={collapsed}
        />
        <SidebarItem
          to="/admin/schedule"
          icon={<Calendar size={20} />}
          label="Schedule Overview"
          active={location.pathname === "/admin/schedule"}
          collapsed={collapsed}
        />
        <SidebarItem
          to="/admin/generate"
          icon={<CalendarDays size={20} />}
          label="Schedule Generation"
          active={location.pathname === "/admin/generate"}
          collapsed={collapsed}
        />
        
        <SidebarItem
          to="/admin/leave"
          icon={<Clock size={20} />}
          label="Leave Management"
          active={location.pathname === "/admin/leave"}
          collapsed={collapsed}
        />
        <SidebarItem
          to="/admin/employees"
          icon={<Users size={20} />}
          label="Employees"
          active={location.pathname === "/admin/employees"}
          collapsed={collapsed}
        />
        <SidebarItem
          to="/admin/reports"
          icon={<FileText size={20} />}
          label="Reports"
          active={location.pathname === "/admin/reports"}
          collapsed={collapsed}
        />
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <SidebarItem
          to="/admin/settings"
          icon={<Settings size={20} />}
          label="Settings"
          active={location.pathname === "/admin/settings"}
          collapsed={collapsed}
        />
        <SidebarItem
          to="/login"
          icon={<LogOut size={20} />}
          label="Log out"
          active={false}
          collapsed={collapsed}
          onClick={() => console.log("Logging out")}
        />
      </div>
    </div>
  );
};

export default AdminSidebar;
