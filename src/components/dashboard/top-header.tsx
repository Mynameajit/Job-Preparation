"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import { ModeToggle } from "@/components/ui/ModeToggle"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/api/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * TopHeader component that displays the sidebar trigger, breadcrumbs,
 * and theme toggle. It dynamically generates breadcrumbs based on the URL.
 */
export function TopHeader() {
  const pathname = usePathname()
  const { data: userResponse } = useUser()
  const user = userResponse?.data?.user

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "ST"
  
  /**
   * Parse the pathname to create dynamic breadcrumbs.
   * Example: /dashboard/student/profile -> Dashboard > Student > Profile
   */
  const paths = pathname.split("/").filter((p) => p !== "")
  const maxItems = 3
  const displayPaths = paths.slice(0, maxItems)
  const isTruncated = paths.length > maxItems

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Button to toggle the sidebar (visible on mobile and if collapsible is not 'none') */}
        <SidebarTrigger className="-ml-1" />
        
        <Separator orientation="vertical" className="h-4" />
        
        {/* Dynamic Breadcrumbs for better navigation awareness */}
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            {displayPaths.map((path, index) => {
              const isActualLast = index === paths.length - 1
              const isTruncatedPoint = index === maxItems - 1 && isTruncated
              const href = `/${paths.slice(0, index + 1).join("/")}`
              const label = path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")

              return (
                <React.Fragment key={path}>
                  <BreadcrumbItem>
                    {isActualLast ? (
                      <BreadcrumbPage className="font-semibold text-foreground">{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                        {label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  
                  {/* Show separator if not the last one in this display list, or if we are about to show ellipsis */}
                  {(index < displayPaths.length - 1 || isTruncatedPoint) && (
                    <BreadcrumbSeparator />
                  )}

                  {/* Add ellipsis if we are at the truncation point */}
                  {isTruncatedPoint && (
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                  )}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme toggle for Dark/Light mode */}
        <ModeToggle />
        
        {/* User profile quick toggle or status could go here */}
        <Avatar className="h-8 w-8 border border-border/50">
          <AvatarImage src={user?.profilePhoto || ""} />
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
