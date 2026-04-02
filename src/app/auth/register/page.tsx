"use client"


import LoginForm from "@/components/auth/LoginForm"
import { BarChart3, Briefcase, Code, FileText } from "lucide-react"
import { motion } from "framer-motion"
import RegisterForm from "@/components/auth/RegisterForm"
import BackgroundGlow from "@/components/ui/BackgroundGlow"

export default function RegisterPage() {

  return (

    <div className=" min-h-screen relative flex w-full h-screen items-center justify-center">
      <BackgroundGlow />

      <div className="  rounded-xl flex w-7xl  justify-between p-1 md:p-8 ">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden md:block space-y-8 p-1"
        >

          {/* Heading */}

          <h1 className="text-5xl font-bold leading-tight">
            Start Your <span className="text-violet-600">Placement</span> Journey 🚀
          </h1>

          {/* Description */}

          <p className="text-lg text-muted-foreground max-w-lg">
            Create your account and start preparing for your dream job.
            Practice coding questions, attempt real placement mock tests,
            build your resume, and master technical interviews —
            all in one platform.
          </p>

          {/* Features */}

          <div className="space-y-4">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Code className="text-violet-600" />
              <p>Practice real coding interview questions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <FileText className="text-violet-600" />
              <p>Take company-level mock tests</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <BarChart3 className="text-violet-600" />
              <p>Track your preparation progress</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <Briefcase className="text-violet-600" />
              <p>Build professional resumes instantly</p>
            </motion.div>

          </div>

        </motion.div>
        {/* RIGHT SIDE IMAGE */}

        <div className="flex items-center justify-center p-0 md:p-6 w-full md:w-auto ">

          <RegisterForm />

        </div>
      </div>

    </div >
  )
}