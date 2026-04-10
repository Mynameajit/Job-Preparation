"use client";

import { useEffect, useState } from "react";
import { Code2, FileText, Trophy, BrainCircuit } from "lucide-react";
import { UpcomingTests } from "@/components/dashboard/UpcomingTests";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CategoryChart } from "@/components/dashboard/charts/CategoryChart";
import { ProgressChart } from "@/components/dashboard/charts/ProgressChart";

import { 
  DashboardSummarySkeleton, 
  DashboardChartSkeleton, 
  DashboardActivitySkeleton, 
  DashboardUpcomingSkeleton 
} from "@/components/dashboard/DashboardLoader";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please login again.");
          } else {
            setError(`Server Error (${response.status}). Our team is looking into it.`);
          }
          return;
        }
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("A network error occurred while loading your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Questions Solved",
      value: data?.stats?.questionsSolved || "0",
      icon: Code2,
      color: "bg-blue-500",
    },
    {
      title: "Mock Tests Taken",
      value: data?.stats?.mockTestsTaken || "0",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Average Score",
      value: `${data?.stats?.averageScore || "0"}%`,
      icon: Trophy,
      color: "bg-yellow-500",
    },
    {
      title: "Interview Readiness",
      value: data?.stats?.interviewReadiness || "N/A",
      icon: BrainCircuit,
      color: "bg-violet-600",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-muted/40 min-h-screen">
        <DashboardSummarySkeleton />
        <DashboardChartSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <DashboardActivitySkeleton />
           <DashboardUpcomingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-screen flex flex-col items-center justify-center space-y-4 bg-muted/40">
        <div className="p-4 bg-red-500/10 text-red-600 rounded-xl border border-red-500/20 max-w-md text-center">
            <h3 className="font-bold mb-1">Configuration Error</h3>
            <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

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
          <ProgressChart data={data?.progressData} />
        </div>

        <div className="h-[320px] min-h-[320px]">
          <CategoryChart data={data?.categoryData} />
        </div>
      </div>

      {/* 🔥 Activity + Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[320px] min-h-[320px]">
          <RecentActivity activities={data?.recentActivities} />
        </div>

        <div className="h-[320px] min-h-[320px]">
          <UpcomingTests tests={data?.upcomingTests} />
        </div>
      </div>
    </div>
  );
}
