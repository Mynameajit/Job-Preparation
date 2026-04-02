import { AppSidebar } from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { ModeToggle } from "@/components/ui/ModeToggle";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Bell } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full bg-background text-foreground">

            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "18rem",
                        "--sidebar-width-mobile": "20rem",
                    } as React.CSSProperties
                }
            >
                <AppSidebar />

                <SidebarInset className="flex flex-col">
                    <Header />
                    {/* PAGE CONTENT */}
                    <div className="flex-1 p-0 overflow-auto">
                        {children}
                    </div>

                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}