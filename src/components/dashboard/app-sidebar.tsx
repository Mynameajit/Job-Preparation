"use client"

import * as React from "react"
import {
  BookOpen,
  Code2,
  FileText,
  LayoutDashboard,
  Settings,
  UserCircle,
  GraduationCap,
  ClipboardCheck,
  BrainCircuit,
  Terminal,
  Users,
  LogOut,
  Loader2
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { useUser, useLogout } from "@/hooks/api/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Sidebar component that provides navigation for both Student and Admin dashboards.
 * It dynamically highlights the active route based on the current pathname.
 */
export function AppSidebar({ role = "student" }: { role?: "student" | "admin" }) {
  const pathname = usePathname()
  const { data: userResponse } = useUser()
  const logout = useLogout()
  const user = userResponse?.data?.user

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "ST"

  /**
   * Navigation items for the Student Dashboard
   */
  const studentItems = [
    {
      title: "Dashboard",
      url: "/dashboard/student",
      icon: LayoutDashboard,
    },
    {
      title: "Interview Preparation",
      url: "/dashboard/student/job-prep",
      icon: GraduationCap,
    },
    {
      title: "Resume Builder",
      url: "/dashboard/student/resume-builder",
      icon: FileText,
    },
    {
      title: "Problem Solving",
      url: "/dashboard/student/problem-solving",
      icon: Terminal,
    },
    {
      title: "Code Scratchpad",
      url: "/dashboard/student/coding-practice",
      icon: BrainCircuit,
    },
    {
      title: "Mock Tests",
      url: "/dashboard/student/mock-tests",
      icon: ClipboardCheck,
    },
    {
      title: "My Results",
      url: "/dashboard/student/results",
      icon: BookOpen,
    },
    {
      title: "Profile",
      url: "/dashboard/student/profile",
      icon: UserCircle,
    },
  ]

  /**
   * Navigation items for the Admin Dashboard
   */
  const adminItems = [
    {
      title: "Admin Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Students",
      url: "/dashboard/admin/students",
      icon: Users,
    },
    {
      title: "Question Bank",
      url: "/dashboard/admin/questions",
      icon: BrainCircuit,
    },
    {
      title: "Mock Tests",
      url: "/dashboard/admin/tests",
      icon: ClipboardCheck,
    },
    {
      title: "Test Results",
      url: "/dashboard/admin/results",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ]

  const items = role === "admin" ? adminItems : studentItems

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
      <SidebarHeader className="px-1 py-6">
        {/* Brand Logo and Name */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            JobPrep AI
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
            Main Menu
          </SidebarGroupLabel>
          <SidebarMenu className="px-0 gap-3 ">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  className="hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all py-4 duration-200"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="py-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="w-full flex items-center justify-between px-2 gap-3 transition-colors duration-200">
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarImage src={user?.profilePhoto || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs group-data-[collapsible=icon]:hidden overflow-hidden">
                  <span className="font-medium text-foreground truncate w-full">{user?.name || "User"}</span>
                  <span className="text-muted-foreground truncate w-full text-[10px]">{user?.email || "email@example.com"}</span>
                </div>
              </div>

              <button 
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all group-data-[collapsible=icon]:hidden disabled:opacity-50"
                title="Logout"
              >
                {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  )
}
