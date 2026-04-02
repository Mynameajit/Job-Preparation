"use client"

import Link from "next/link"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    Code2,
    FileText,
    BrainCircuit,
    BarChart3,
    User,
    LogOut,

} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useRedux"
import { logoutUser } from "@/feature/user/userService"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Spinner } from "../ui/spinner"

const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Coding Practice",
        url: "/dashboard/practice",
        icon: Code2
    },
    {
        title: "Mock Tests",
        url: "/dashboard/tests",
        icon: FileText
    },
    {
        title: "My Results",
        url: "/dashboard/results",
        icon: FileText
    },
    {
        title: "Interview Prep",
        url: "/dashboard/interview",
        icon: BrainCircuit
    },
    {
        title: "Resume Builder",
        url: "/dashboard/resume",
        icon: FileText
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User
    }
]

export function AppSidebar() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading } = useSelector((state: RootState) => state.user)


    const handlerLogout = async () => {
        try {
            const data = await dispatch(logoutUser()).unwrap()
            if (data.success) {
                router.push("/")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (

        <Sidebar >

            {/* Header */}

            <SidebarHeader className="text-2xl font-bold px-4 py-4 border-b-2 ">
                <div className="flex gap-2">
                    <span className=" bg-linear-to-r from-violet-600 to-purple-600 text-white py-0.5 px-1 rounded-lg">JP</span>
                    JobPrep
                </div>

            </SidebarHeader>



            {/* Main Menu */}

            <SidebarContent>

                <SidebarGroup>

                    <SidebarMenu className="space-y-2 mt-4">

                        {menuItems.map((item) => {

                            const Icon = item.icon
                            const pathname = usePathname()

                            const isActive = pathname === item.url

                            return (
                                <SidebarMenuItem key={item.title}>

                                    <SidebarMenuButton asChild>

                                        <Link
                                            href={item.url}
                                            className={`
              flex items-center gap-3
              px-4 py-5
              rounded-lg
               font-medium
              transition-all
              ${isActive
                                                    ? "bg-violet-600 text-white"
                                                    : "hover:bg-muted"}
            `}
                                        >

                                            <Icon size={20} />

                                            <span className="text-[15px]">
                                                {item.title}
                                            </span>

                                        </Link>

                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            )

                        })}

                    </SidebarMenu>

                </SidebarGroup>

            </SidebarContent>



            {/* Footer */}

            <SidebarFooter>

                <SidebarMenu>

                    <SidebarMenuItem>

                        <SidebarMenuButton onClick={handlerLogout}>
                            {
                                loading.logout ?
                                    <Spinner className="size-6" data-icon="inline-start" />
                                    : (<>
                                        <LogOut size={18} />

                                        <span>Logout</span>
                                    </>)
                            }


                        </SidebarMenuButton>

                    </SidebarMenuItem>

                </SidebarMenu>

            </SidebarFooter>

        </Sidebar>

    )
}