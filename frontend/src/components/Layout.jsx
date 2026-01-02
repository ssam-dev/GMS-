import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCheck, 
  Dumbbell, 
  Menu,
  X,
  Settings,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AdminProfileModal from "../components/admin/AdminProfileModal";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    url: createPageUrl("Members"),
    icon: Users,
  },
  // Removed "Classes" item as per instructions
  // {
  //   title: "Classes",
  //   url: createPageUrl("Classes"),
  //   icon: Calendar,
  // },
  {
    title: "Trainers",
    url: createPageUrl("Trainers"),
    icon: UserCheck,
  },
  {
    title: "Equipment",
    url: createPageUrl("Equipment"),
    icon: Dumbbell,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      // User.logout() will handle the redirect
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getInitials = (user) => {
    if (!user) return "A";
    if (user.full_name) {
      const names = user.full_name.split(" ");
      return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
    }
    return user.email ? user.email[0].toUpperCase() : "A";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <style>
          {`
            :root {
              --primary: 15 23 42;
              --primary-foreground: 248 250 252;
              --secondary: 30 41 59;
              --accent: 37 99 235;
              --muted: 241 245 249;
              --card: 255 255 255;
              --border: 226 232 240;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-slate-200 bg-white/95 backdrop-blur-md">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">GMS</h2>
                <p className="text-xs text-slate-500">Gym Management System</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                            : 'text-slate-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-slate-50">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-slate-600 font-semibold text-sm">
                        {getInitials(currentUser)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {currentUser?.full_name || "Admin"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser?.email || "Gym Manager"}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">GMS</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>

        {/* Admin Profile Modal */}
        {showProfileModal && (
          <AdminProfileModal
            user={currentUser}
            onClose={() => setShowProfileModal(false)}
            onUpdate={(updatedUser) => {
              setCurrentUser(updatedUser);
              setShowProfileModal(false);
            }}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
