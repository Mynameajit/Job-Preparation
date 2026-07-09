"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"


export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // 🔥 VERY IMPORTANT
    if (!mounted) return null
    return (
        <div>
            {
                theme === "light" ? (
                    <Button variant="outline" size="icon" onClick={() => setTheme("dark")}>
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] " />
                    </Button>
                ) : (
                    <Button variant="outline" size="icon" onClick={() => setTheme("light")}>
                        <Sun className="h-[1.2rem] w-[1.2rem] " />
                    </Button>
                )
            }

        </div>

    )
}
