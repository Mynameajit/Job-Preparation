"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Hero() {
  return (
    <section className="container mx-auto px-6 py-24">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}

       <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >


          {/* Badge */}

          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm text-primary mb-2">
            🚀 Trusted by 10,000+ students
          </div>

          {/* Heading */}

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">

            Prepare for Your

            <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">

              Dream Job

            </span>

          </h1>

          {/* Description */}

          <p className="mt-4 text-lg text-muted-foreground max-w-xl">

            Master coding interviews, practice with real questions,
            and land your dream job at top tech companies like Google,
            Amazon, and Microsoft.

          </p>

          {/* Buttons */}

          <div className="flex gap-4 mt-6">

            <Link href="/register">

              <Button
                size="lg"
                className="gap-2 text-base px-6 py-6"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>

            </Link>

            <Link href="/practice">

              <Button
                size="lg"
                variant="outline"
                className="px-6 py-6 text-base"
              >
                Practice Coding
              </Button>

            </Link>

          </div>

          {/* Stats */}

          <div className="flex gap-10 mt-10">

            <div>

              <p className="text-3xl font-bold text-indigo-500">
                10,000+
              </p>

              <p className="text-muted-foreground text-sm">
                Students Placed
              </p>

            </div>

            <div>

              <p className="text-3xl font-bold text-purple-500">
                500+
              </p>

              <p className="text-muted-foreground text-sm">
                Practice Problems
              </p>

            </div>

            <div>

              <p className="text-3xl font-bold text-pink-500">
                200+
              </p>

              <p className="text-muted-foreground text-sm">
                Mock Tests
              </p>

            </div>

          </div>

        </motion.div>

        {/* RIGHT IMAGE */}

         <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >

          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
            alt="students coding"
            width={800}
            height={600}
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className={cn("rounded-3xl shadow-2xl object-cover")}
          />

          {/* glow effect */}

          <div className="absolute -z-10 top-10 left-10 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full"></div>

        </motion.div>

      </div>

    </section>
  )
}