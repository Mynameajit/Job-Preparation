import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder",
};

export default function ResumeBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
