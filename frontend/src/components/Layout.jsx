import React, { useState, useEffect, useRef } from "react";
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
  LogOut,
  Bell
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
  useSidebar,
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

// Mobile sidebar overlay - rendered inside the provider so it can use the sidebar context
function MobileSidebar({ navigationItems, currentUser, getInitials, handleLogout }) {
  const { openMobile, setOpenMobile } = useSidebar();
  if (!openMobile) return null;
  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpenMobile(false)} />
      <aside className="relative w-72 max-w-full bg-[#121A2F] p-4 shadow-xl overflow-auto transform transition-transform duration-200 border-r border-slate-800">
        <SidebarHeader className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">GMS</h2>
              <p className="text-xs text-slate-400">Gym Management System</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={`hover:bg-blue-600/10 hover:text-blue-500 transition-all duration-200 rounded-xl text-slate-300`}>
                      <Link to={item.url} className="flex items-center gap-3 px-4 py-3" onClick={() => setOpenMobile(false)}>
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

        <SidebarFooter className="border-t border-slate-800 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-slate-800/50">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="text-slate-300 font-semibold text-sm">{getInitials(currentUser)}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-white text-sm truncate">{currentUser?.full_name || "Admin"}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser?.email || "Gym Manager"}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#121A2F] border-slate-800 text-white">
              <DropdownMenuItem onClick={() => setOpenMobile(false)} className="hover:bg-slate-800 focus:bg-slate-800">
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem onClick={() => { setOpenMobile(false); handleLogout(); }} className="text-red-500 hover:bg-slate-800 focus:bg-slate-800">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </aside>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationMenuRef = useRef(null);
  const notifications = [
    {
      id: 1,
      title: "System is operational",
      description: "All services are running normally.",
      read: true,
    },
    {
      id: 2,
      title: "No new alerts",
      description: "You're all caught up.",
      read: true,
    },
  ];
  const unreadCount = notifications.filter((notification) => !notification.read).length;

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

  const handleNotificationsClick = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleClickOutside = (event) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isNotificationsOpen]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#0A0F1C] text-white overflow-hidden">
        
        <Sidebar className="border-r border-slate-800 bg-[#121A2F]">
          <SidebarHeader className="border-b border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">GMS</h2>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Gym Manager</p>
                </div>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = item.url === "/"
                      ? location.pathname === "/"
                      : location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-blue-600/10 hover:text-blue-500 transition-all duration-200 rounded-xl ${
                            isActive 
                              ? 'bg-blue-600/10 text-blue-500' 
                              : 'text-slate-400'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-slate-500"}`} />
                            <span className="font-medium text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-800 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto hover:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-[#0A0F1C] border border-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-slate-400 font-semibold text-sm">
                        {getInitials(currentUser)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-white text-sm truncate">
                        {currentUser?.full_name || "Admin User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser?.email || "admin@gymsystem.com"}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#121A2F] border-slate-800 text-white">
                <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-[#121A2F] border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-800 text-slate-300 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-semibold text-white md:hidden">GMS</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={notificationMenuRef}>
                <button
                  type="button"
                  onClick={handleNotificationsClick}
                  aria-label="Toggle notifications"
                  aria-haspopup="menu"
                  aria-expanded={isNotificationsOpen}
                  className="text-slate-400 hover:text-white transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div
                    role="menu"
                    aria-label="Notifications"
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-[#121A2F] shadow-xl p-3 z-20"
                  >
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Notifications</p>
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="rounded-lg border border-slate-800 bg-[#1A233A] p-3">
                          <p className="text-sm text-white">{notification.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{notification.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-[#0A0F1C] p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </div>
        </main>

        <MobileSidebar
          navigationItems={navigationItems}
          currentUser={currentUser}
          getInitials={getInitials}
          handleLogout={handleLogout}
        />

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
