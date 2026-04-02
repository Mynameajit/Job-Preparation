"use client";

import { Code2, FileText, Trophy, BrainCircuit } from "lucide-react";
import { UpcomingTests } from "@/components/dashboard/UpcomingTests";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CategoryChart } from "@/components/dashboard/charts/CategoryChart";
import { ProgressChart } from "@/components/dashboard/charts/ProgressChart";

export default function Dashboard() {

  const cards = [
    {
      title: "Questions Solved",
      value: "124",
      icon: Code2,
      color: "bg-blue-500",
    },
    {
      title: "Mock Tests Taken",
      value: "18",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Average Score",
      value: "78%",
      icon: Trophy,
      color: "bg-yellow-500",
    },
    {
      title: "Interview Readiness",
      value: "Good",
      icon: BrainCircuit,
      color: "bg-violet-600",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-muted/40 ">
      {/* 🔥 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="p-5 rounded-xl border bg-background flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
              </div>

              <div className={`p-3 rounded-lg text-white ${card.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 Charts Section (FIXED HEIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[320px] min-h-[320px]">
          <ProgressChart />
        </div>

        <div className="h-[320px] min-h-[320px]">
          <CategoryChart />
        </div>
      </div>

      {/* 🔥 Activity + Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[320px] min-h-[320px]">
          <RecentActivity />
        </div>

        <div className="h-[320px] min-h-[320px]">
          <UpcomingTests />
        </div>
      </div>
    </div>
  );
}
