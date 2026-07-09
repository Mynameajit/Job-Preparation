import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Questions",
};

export default function QuestionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
