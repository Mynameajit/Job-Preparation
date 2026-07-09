import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"

/**
 * Layout for the Student Dashboard.
 * It provides the sidebar navigation and a consistent top header across all student pages.
 */
export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()
  if (!user || user.role !== "STUDENT") {
    redirect("/auth/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* The Sidebar navigation specialized for students */}
        <AppSidebar role="student" />
        
        {/* Main content area */}
        <SidebarInset className="flex flex-col flex-1">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
