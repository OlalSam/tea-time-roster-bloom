.gitignore
node_modules
dist
build
out
.next
coverage
*.log
.env*
.DS_Store
tmp
*.tmp
*.log

import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, navigate } from 'your-routing-library'; // Replace with your actual import


const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-border py-3 px-6 flex items-center justify-between">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-1 rounded-full">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="/placeholder.svg" alt="Admin" />
                <AvatarFallback className="bg-forest text-cream">AM</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">Alex Morgan</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate('/admin/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>Settings</DropdownMenuItem>
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
    </header>
  );
};

export default AdminHeader;