"use client";


import AccountSection from "@/components/dashboard/profile/AccountSection";
import PerformanceSection from "@/components/dashboard/profile/PerformanceSection";
import ProfileHeader from "@/components/dashboard/profile/ProfileHeader";
import RecentActivity from "@/components/dashboard/profile/RecentActivity";
import SkillsSection from "@/components/dashboard/profile/SkillsSection";
import StatsSection from "@/components/dashboard/profile/StatsSection";
import type { User } from "@/types/user";

export default function ProfilePage() {

  // 🔥 TEMP DATA (tum backend se replace kar dena)
  const user: User = {
    _id: "69b184423cb33b55ea2bceb8",
    name: "Ajit Kumar Verma",
    email: "ajit@gmail.com",
    role: "Student",
    college: "GLA University",
    location: "Mathura, India",
    phone: "9876543210",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    stats: {
      totalTests: 12,
      avgScore: 68,
      highestScore: 90,
      questionsSolved: 120,
    },
    recentResults: [
      { title: "React Test", score: 80, date: "2026-03-20" },
      { title: "JS Test", score: 65, date: "2026-03-18" },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <ProfileHeader user={user} />
      <StatsSection stats={user.stats} />
      <div className="grid md:grid-cols-2 gap-6">
        <SkillsSection skills={user.skills} />
        <PerformanceSection stats={user.stats} />
      </div>
      <RecentActivity results={user.recentResults} />
      <AccountSection />
    </div>
  );
}