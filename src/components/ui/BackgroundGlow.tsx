import { cn } from "@/lib/utils"

export default function BackgroundGlow() {
  return (

    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* circle 1 */}

      <div className={cn("absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]")} />

      {/* circle 2 */}

      <div className={cn("absolute bottom-[-120px] right-[-120px] w-[450px] h-[450px] bg-indigo-500/20 rounded-full blur-[140px]")} />

      {/* circle 3 */}

      <div className={cn("absolute top-[40%] left-[30%] w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-[120px]")} />

    </div>

  )
}