import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Preparation",
};

export default function JobPrepLayout({ children }: { children: React.ReactNode }) {
  return children;
}
