import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Students",
};

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
