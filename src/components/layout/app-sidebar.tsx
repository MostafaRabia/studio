"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppLogo } from "./app-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Users, Megaphone, HelpCircle, Library, Settings, LogOut, Users as UsersIcon, Bell, Plane, DollarSign, ClipboardList, MessageSquare, SlidersHorizontal, LineChart as LineChartIcon } from "lucide-react"; // Added LineChartIcon

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/employees/hierarchy", label: "Hierarchy", icon: UsersIcon },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/faq", label: "AI FAQ", icon: HelpCircle },
  { href: "/resources", label: "Resources", icon: Library },
  { href: "/vacations", label: "Vacations", icon: Plane },
  { href: "/salaries", label: "Salaries", icon: DollarSign },
  { href: "/hiring", label: "Hiring", icon: ClipboardList },
  { href: "/reports/salary-headcount", label: "Salary Report", icon: LineChartIcon }, // New Report Link
  { href: "/configurator", label: "Configurator", icon: SlidersHorizontal },
];

interface AppSidebarProps {
  toggleChatPanel: () => void;
}

export function AppSidebar({ toggleChatPanel }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left">
      <SidebarHeader className="items-center justify-between">
        <AppLogo />
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <Separator className="my-2" />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: "right", align: "center" }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-2" />
      <SidebarFooter className="p-2">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={toggleChatPanel}
              tooltip={{ children: "Chat", side: "right", align: "center" }}
            >
              <MessageSquare />
              <span>Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: "Notifications", side: "right", align: "center" }}>
              <Bell />
              <span>Notifications</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Settings button removed */}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: "Logout", side: "right", align: "center" }}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
