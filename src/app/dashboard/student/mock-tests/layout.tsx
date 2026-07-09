import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Tests",
};

export default function MockTestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
