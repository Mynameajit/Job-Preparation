"use client"


import LoginForm from "@/components/auth/LoginForm"
import { BarChart3, Briefcase, Code, FileText } from "lucide-react"
import { motion } from "framer-motion"
import BackgroundGlow from "@/components/ui/BackgroundGlow"

export default function LoginPage() {

  return (

    <div className=" min-h-screen relative flex w-full h-screen items-center justify-center">
      <BackgroundGlow />

      <div className="gap-8  rounded-xl  flex w-7xl  justify-between p-10 ">

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="sm:display-none md:block p-1 space-y-8 w-full"
        >

          {/* HEADING */}

          <h1 className="text-5xl font-bold leading-tight">
            Join <span className="text-violet-600">JobPrep</span> 🚀
          </h1>


          {/* DESCRIPTION */}

          <p className="text-lg text-muted-foreground">
            Prepare for your dream job with everything in one place.
            Practice coding problems, take real placement mock tests,
            improve your interview skills, and track your preparation progress.
          </p>


          {/* FEATURES */}

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
              <p>Get ready for real placement interviews</p>
            </motion.div>

          </div>

        </motion.div>
        {/* RIGHT SIDE IMAGE */}

        <div className="  p-6">

          <LoginForm />

        </div>
      </div>

    </div >
  )
}