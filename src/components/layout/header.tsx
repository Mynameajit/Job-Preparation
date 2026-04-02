"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "../ui/ModeToggle"
import { SidebarTrigger } from "../ui/sidebar"
import { useAppSelector } from "@/hooks/useRedux"

export default function Header() {
const {user}=useAppSelector((state) => state.user)
console.log(user);

  return (
    <>
      {/* HEADER */}
      <header className="h-16 border-b flex items-center justify-between px-4 bg-background sticky top-0 z-50">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <SidebarTrigger />

          <div className="w-[1px] h-5 bg-border" />

          <h1 className="hidden md:block text-lg font-semibold">
            JobPrep Dashboard
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 py-[1px] rounded-full">
              3
            </span>
          </button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-medium">
              A
            </div>
          </div>
        </div>
      </header>
    </>
  )
}