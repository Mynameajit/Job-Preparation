"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ModeToggle } from "../ui/ModeToggle"
import { useAppSelector } from "@/hooks/useRedux"
import { LayoutDashboard } from "lucide-react"

export default function Navbar() {
  const { user } = useAppSelector((state) => state.user)

  return (

    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="
      sticky
      top-0
      z-50
      w-full
      border-b
      bg-background/70
      backdrop-blur-xl
      supports-[backdrop-filter]:bg-background/70
      "
    >

      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">

        {/* Logo */}

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold shadow">

            JP

          </div>

          <span className="font-semibold text-lg tracking-tight">

            JobPrep

          </span>

        </motion.div>

        {/* Right buttons */}

        <div className="flex items-center gap-3">

          {
            user ? (
              <Link className="mr-2" href="/dashboard ">

                <Button
                  className="bg-linear-to-r from-indigo-500 to-purple-500 hover:opacity-90 cursor-pointer text-white"
                >
                  <LayoutDashboard />
                  Dashboard
                </Button>
              </Link>

            ) : (
              <div>

                <Link href="/auth/login">

                  <Button
                    variant="ghost"
                    className="hover:bg-muted cursor-pointer"
                  >
                    Login
                  </Button>

                </Link>

                <Link href="/auth/register">

                  <Button
                    className="bg-linear-to-r from-indigo-500 to-purple-500 hover:opacity-90 cursor-pointer text-white"
                  >
                    Get Started
                  </Button>

                </Link>
              </div>
            )
          }


          {/* Theme toggle */}


          <ModeToggle />
        </div>

      </div>

    </motion.header>

  )
}